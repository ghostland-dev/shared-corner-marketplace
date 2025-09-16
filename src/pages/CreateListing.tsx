
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Upload, Plus, Minus, Calendar, MapPin } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useFileUpload } from '@/hooks/useFileUpload';
import { useCreateListing } from '@/hooks/useCreateListing';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { categories } from '@/data/categories';

// Schéma de validation
const formSchema = z.object({
  title: z.string().min(5, { message: "Le titre doit comporter au moins 5 caractères" }).max(100),
  description: z.string().min(20, { message: "La description doit comporter au moins 20 caractères" }),
  categoryId: z.string({ required_error: "Veuillez sélectionner une catégorie" }),
  price: z.number().positive({ message: "Le prix doit être positif" }),
  priceUnit: z.enum(["heure", "jour", "semaine", "mois"]),
  location: z.string().min(3, { message: "L'adresse est requise" }),
  features: z.array(z.string()).optional(),
  availability: z.object({
    monday: z.boolean(),
    tuesday: z.boolean(),
    wednesday: z.boolean(),
    thursday: z.boolean(),
    friday: z.boolean(),
    saturday: z.boolean(),
    sunday: z.boolean(),
  }),
  images: z.array(z.string()).optional(),
});

type FormData = z.infer<typeof formSchema>;

const CreateListing = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [images, setImages] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>(["", "", ""]);
  const [uploading, setUploading] = useState(false);
  const { uploadListingImage } = useFileUpload();
  const { createListing, loading } = useCreateListing();

  // Initialiser le formulaire
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      categoryId: "",
      price: 0,
      priceUnit: "jour",
      location: "",
      features: [],
      availability: {
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: true,
        sunday: true,
      },
      images: [],
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > 8) {
      toast({
        title: "Limite d'images atteinte",
        description: "Vous ne pouvez ajouter que 8 images maximum",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const { url, error } = await uploadListingImage(file);
        
        if (error) {
          console.error('Error uploading image:', error);
          toast({
            title: "Erreur d'upload",
            description: `Impossible d'uploader ${file.name}`,
            variant: "destructive",
          });
          continue;
        }

        if (url) {
          uploadedUrls.push(url);
        }
      }

      if (uploadedUrls.length > 0) {
        setImages(prev => [...prev, ...uploadedUrls]);
        toast({
          title: "Images uploadées",
          description: `${uploadedUrls.length} image(s) ajoutée(s) avec succès`,
        });
      }
    } catch (error) {
      console.error('Error in handleImageUpload:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'upload des images",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const addFeature = () => {
    setFeatures(prev => [...prev, ""]);
  };

  const removeFeature = (index: number) => {
    setFeatures(prev => prev.filter((_, i) => i !== index));
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };

  const onSubmit = async (data: FormData) => {
    if (images.length === 0) {
      toast({
        title: "Images requises",
        description: "Veuillez ajouter au moins une image à votre annonce",
        variant: "destructive",
      });
      return;
    }

    // Préparer les données pour l'API Supabase
    const listingData = {
      title: data.title,
      description: data.description,
      price: data.price,
      price_unit: data.priceUnit,
      location: data.location,
      category_id: data.categoryId,
      image_urls: images,
      features: features.filter(f => f.trim() !== ""),
      is_available: true,
    };

    await createListing(listingData);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        <div className="kiwiiz-container py-8">
          {/* En-tête */}
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center text-gray-600 hover:text-kiwiiz-primary mb-2">
              <ChevronLeft className="h-5 w-5 mr-1" />
              <span>Retour à l'accueil</span>
            </Link>
            <h1 className="text-3xl font-bold">Déposer une annonce</h1>
            <p className="text-gray-600 mt-2">Remplissez le formulaire ci-dessous pour mettre votre objet ou service en location</p>
          </div>
          
          {/* Formulaire */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-4">Informations générales</h2>
                  
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel>Titre de l'annonce*</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Perceuse Bosch professionnelle" {...field} />
                        </FormControl>
                        <FormDescription>
                          Choisissez un titre clair et précis pour attirer l'attention
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel>Description*</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Décrivez votre objet ou service en détail..."
                            className="min-h-32"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Soyez précis et mentionnez l'état, les caractéristiques et les conditions de location
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="categoryId"
                      render={({ field }) => (
                        <FormItem className="mb-4">
                          <FormLabel>Catégorie*</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez une catégorie" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem className="mb-4">
                          <FormLabel>Adresse*</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input placeholder="Ex: Lyon 3e" {...field} className="pl-10" />
                              <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Indiquez votre quartier ou code postal
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-4">Prix et disponibilités</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem className="mb-4">
                          <FormLabel>Prix*</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0" 
                              step="0.01" 
                              placeholder="19.99"
                              {...field}
                              onChange={e => field.onChange(parseFloat(e.target.value) || 0)} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="priceUnit"
                      render={({ field }) => (
                        <FormItem className="mb-4">
                          <FormLabel>Unité de temps*</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez une unité" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="heure">Par heure</SelectItem>
                              <SelectItem value="jour">Par jour</SelectItem>
                              <SelectItem value="semaine">Par semaine</SelectItem>
                              <SelectItem value="mois">Par mois</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {/* Disponibilité */}
                  <div className="mt-6">
                    <h3 className="font-medium mb-3 flex items-center">
                      <Calendar className="h-5 w-5 mr-2" />
                      Disponibilité
                    </h3>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-7 gap-3 mb-4">
                      {Object.keys(form.getValues().availability).map((day) => (
                        <FormField
                          key={day}
                          control={form.control}
                          name={`availability.${day}` as any}
                          render={({ field }) => (
                            <FormItem className="flex flex-col items-center space-y-1">
                              <FormLabel className="capitalize">{day}</FormLabel>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-4">Caractéristiques et photos</h2>
                  
                  {/* Caractéristiques */}
                  <div className="mb-6">
                    <h3 className="font-medium mb-3">Caractéristiques</h3>
                    
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 mb-2">
                        <Input 
                          value={feature}
                          onChange={(e) => updateFeature(index, e.target.value)}
                          placeholder={`Caractéristique ${index + 1}`}
                        />
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="icon"
                          onClick={() => removeFeature(index)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="mt-2"
                      onClick={addFeature}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter une caractéristique
                    </Button>
                  </div>
                  
                  {/* Images */}
                  <div>
                    <h3 className="font-medium mb-3">Photos</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Ajoutez des photos attrayantes de votre objet ou service. La première photo sera utilisée comme image principale.
                    </p>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                      {images.map((img, index) => (
                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                          <img 
                            src={img} 
                            alt={`Image ${index + 1}`} 
                            className="w-full h-full object-cover"
                          />
                          <Button 
                            type="button" 
                            variant="destructive" 
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6"
                            onClick={() => removeImage(index)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                      
                      <label 
                        className={`aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition ${
                          uploading ? 'bg-muted cursor-not-allowed' : 'hover:bg-muted/50'
                        } ${images.length >= 8 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <Upload className={`h-8 w-8 mb-2 ${uploading ? 'animate-pulse' : ''} text-muted-foreground`} />
                        <span className="text-sm text-muted-foreground text-center px-2">
                          {uploading ? 'Upload...' : images.length >= 8 ? 'Max 8 photos' : 'Ajouter une photo'}
                        </span>
                        <input 
                          type="file" 
                          accept="image/*,image/heic,image/heif" 
                          multiple
                          onChange={handleImageUpload}
                          className="hidden" 
                          disabled={uploading || images.length >= 8}
                        />
                      </label>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <p className="text-sm text-muted-foreground">
                        Ajoutez jusqu'à 8 photos. La première sera l'image principale.
                      </p>
                      {images.length > 0 && (
                        <span className="text-sm font-medium">
                          {images.length}/8 photos
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-4">Conditions de location</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox id="terms" />
                      <div>
                        <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          J'accepte les Conditions Générales d'Utilisation de Kiwiiz
                        </label>
                        <p className="text-sm text-gray-500 mt-1">
                          En acceptant, je certifie avoir le droit de mettre en location cet objet ou service.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Checkbox id="responsibility" />
                      <div>
                        <label htmlFor="responsibility" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Je suis responsable de mon annonce et de sa gestion
                        </label>
                        <p className="text-sm text-gray-500 mt-1">
                          Je m'engage à être réactif aux demandes et à maintenir mon calendrier à jour.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline">Enregistrer en brouillon</Button>
                <Button 
                  type="submit" 
                  className="kiwiiz-btn-primary" 
                  disabled={loading || uploading}
                >
                  {loading ? 'Publication...' : 'Publier l\'annonce'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CreateListing;
