import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Users, 
  Settings, 
  Shield, 
  Database, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  EyeOff,
  Save
} from 'lucide-react';
import { useUserRoles, UserRole } from '@/hooks/useUserRoles';
import { useCategoryManagement, Category, CategoryQuestion } from '@/hooks/useCategoryManagement';
import { useAuth } from '@/contexts/AuthContext';

export const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { allUsers, loading: usersLoading, loadAllUsers, assignRole, removeRole, isSuperAdmin } = useUserRoles();
  const { 
    categories, 
    questions, 
    loading: categoriesLoading, 
    loadCategories,
    loadQuestions,
    createCategory,
    updateCategory,
    deleteCategory,
    createQuestion,
    updateQuestion,
    deleteQuestion
  } = useCategoryManagement();

  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isCreateCategoryOpen, setIsCreateCategoryOpen] = useState(false);
  const [isCreateQuestionOpen, setIsCreateQuestionOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<CategoryQuestion | null>(null);

  // Formulaires
  const [categoryForm, setCategoryForm] = useState({
    id: '',
    name: '',
    description: '',
    icon: '',
    color: '#3b82f6',
    is_active: true
  });

  const [questionForm, setQuestionForm] = useState<{
    question: string;
    question_type: 'text' | 'select' | 'multiple_choice' | 'boolean';
    is_required: boolean;
    order_index: number;
    options: any;
  }>({
    question: '',
    question_type: 'text',
    is_required: false,
    order_index: 0,
    options: null
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (!isSuperAdmin()) {
      navigate('/');
      return;
    }

    loadAllUsers();
    loadCategories();
  }, [user, isSuperAdmin, navigate]);

  useEffect(() => {
    if (selectedCategory) {
      loadQuestions(selectedCategory);
    }
  }, [selectedCategory]);

  const resetCategoryForm = () => {
    setCategoryForm({
      id: '',
      name: '',
      description: '',
      icon: '',
      color: '#3b82f6',
      is_active: true
    });
    setEditingCategory(null);
  };

  const resetQuestionForm = () => {
    setQuestionForm({
      question: '',
      question_type: 'text',
      is_required: false,
      order_index: 0,
      options: null
    });
    setEditingQuestion(null);
  };

  const handleCreateCategory = async () => {
    try {
      await createCategory(categoryForm);
      setIsCreateCategoryOpen(false);
      resetCategoryForm();
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory) return;
    
    try {
      await updateCategory(editingCategory.id, categoryForm);
      setEditingCategory(null);
      resetCategoryForm();
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const handleCreateQuestion = async () => {
    if (!selectedCategory) return;

    try {
      await createQuestion({
        ...questionForm,
        category_id: selectedCategory
      });
      setIsCreateQuestionOpen(false);
      resetQuestionForm();
    } catch (error) {
      console.error('Error creating question:', error);
    }
  };

  const handleUpdateQuestion = async () => {
    if (!editingQuestion) return;
    
    try {
      await updateQuestion(editingQuestion.id, questionForm);
      setEditingQuestion(null);
      resetQuestionForm();
    } catch (error) {
      console.error('Error updating question:', error);
    }
  };

  const startEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryForm({
      id: category.id,
      name: category.name,
      description: category.description || '',
      icon: category.icon || '',
      color: category.color || '#3b82f6',
      is_active: category.is_active
    });
  };

  const startEditQuestion = (question: CategoryQuestion) => {
    setEditingQuestion(question);
    setQuestionForm({
      question: question.question,
      question_type: question.question_type,
      is_required: question.is_required,
      order_index: question.order_index,
      options: question.options
    });
  };

  const roleLabels: Record<UserRole, string> = {
    user: 'Utilisateur',
    admin: 'Administrateur',
    manager: 'Manager',
    super_admin: 'Super Admin'
  };

  const roleColors: Record<UserRole, string> = {
    user: 'default',
    admin: 'secondary',
    manager: 'outline',
    super_admin: 'destructive'
  };

  if (!isSuperAdmin()) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-destructive mb-4">Accès refusé</h1>
            <p className="text-muted-foreground">Vous n'avez pas les permissions pour accéder à cette page.</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Tableau de bord Super Admin</h1>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Utilisateurs
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Catégories
            </TabsTrigger>
            <TabsTrigger value="questions" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Questions
            </TabsTrigger>
          </TabsList>

          {/* Gestion des utilisateurs */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des utilisateurs et rôles</CardTitle>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="text-center py-8">Chargement...</div>
                ) : (
                  <div className="space-y-4">
                    {allUsers.map((userData) => (
                      <div key={userData.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{userData.full_name || userData.username || 'Utilisateur'}</p>
                            <p className="text-sm text-muted-foreground">{userData.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {userData.roles.map((role) => (
                            <Badge key={role} variant={roleColors[role] as any}>
                              {roleLabels[role]}
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-4 w-4 p-0 ml-1"
                                onClick={() => removeRole(userData.id, role)}
                              >
                                ×
                              </Button>
                            </Badge>
                          ))}
                          <Select onValueChange={(role: UserRole) => assignRole(userData.id, role)}>
                            <SelectTrigger className="w-40">
                              <SelectValue placeholder="Ajouter rôle" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">Utilisateur</SelectItem>
                              <SelectItem value="admin">Administrateur</SelectItem>
                              <SelectItem value="manager">Manager</SelectItem>
                              <SelectItem value="super_admin">Super Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gestion des catégories */}
          <TabsContent value="categories">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Gestion des catégories</CardTitle>
                <Dialog open={isCreateCategoryOpen} onOpenChange={setIsCreateCategoryOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={resetCategoryForm}>
                      <Plus className="h-4 w-4 mr-2" />
                      Nouvelle catégorie
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Créer une catégorie</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="id">ID de la catégorie</Label>
                        <Input
                          id="id"
                          value={categoryForm.id}
                          onChange={(e) => setCategoryForm(prev => ({ ...prev, id: e.target.value }))}
                          placeholder="vehicles, tools, etc."
                        />
                      </div>
                      <div>
                        <Label htmlFor="name">Nom</Label>
                        <Input
                          id="name"
                          value={categoryForm.name}
                          onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={categoryForm.description}
                          onChange={(e) => setCategoryForm(prev => ({ ...prev, description: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="icon">Icône (Lucide)</Label>
                        <Input
                          id="icon"
                          value={categoryForm.icon}
                          onChange={(e) => setCategoryForm(prev => ({ ...prev, icon: e.target.value }))}
                          placeholder="Car, Wrench, etc."
                        />
                      </div>
                      <div>
                        <Label htmlFor="color">Couleur</Label>
                        <Input
                          id="color"
                          type="color"
                          value={categoryForm.color}
                          onChange={(e) => setCategoryForm(prev => ({ ...prev, color: e.target.value }))}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="is_active"
                          checked={categoryForm.is_active}
                          onCheckedChange={(checked) => setCategoryForm(prev => ({ ...prev, is_active: checked }))}
                        />
                        <Label htmlFor="is_active">Catégorie active</Label>
                      </div>
                      <Button onClick={handleCreateCategory} className="w-full">
                        Créer
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                          style={{ backgroundColor: category.color }}
                        >
                          {category.icon ? category.icon.slice(0, 2) : '?'}
                        </div>
                        <div>
                          <p className="font-medium">{category.name}</p>
                          <p className="text-sm text-muted-foreground">{category.description}</p>
                          <p className="text-xs text-muted-foreground">ID: {category.id}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={category.is_active ? 'default' : 'secondary'}>
                          {category.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startEditCategory(category)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteCategory(category.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Dialog d'édition de catégorie */}
            <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Modifier la catégorie</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="edit-name">Nom</Label>
                    <Input
                      id="edit-name"
                      value={categoryForm.name}
                      onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-description">Description</Label>
                    <Textarea
                      id="edit-description"
                      value={categoryForm.description}
                      onChange={(e) => setCategoryForm(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-icon">Icône (Lucide)</Label>
                    <Input
                      id="edit-icon"
                      value={categoryForm.icon}
                      onChange={(e) => setCategoryForm(prev => ({ ...prev, icon: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-color">Couleur</Label>
                    <Input
                      id="edit-color"
                      type="color"
                      value={categoryForm.color}
                      onChange={(e) => setCategoryForm(prev => ({ ...prev, color: e.target.value }))}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="edit-is_active"
                      checked={categoryForm.is_active}
                      onCheckedChange={(checked) => setCategoryForm(prev => ({ ...prev, is_active: checked }))}
                    />
                    <Label htmlFor="edit-is_active">Catégorie active</Label>
                  </div>
                  <Button onClick={handleUpdateCategory} className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    Sauvegarder
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* Gestion des questions */}
          <TabsContent value="questions">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Gestion des questions par catégorie</CardTitle>
                <div className="flex gap-2">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-60">
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedCategory && (
                    <Dialog open={isCreateQuestionOpen} onOpenChange={setIsCreateQuestionOpen}>
                      <DialogTrigger asChild>
                        <Button onClick={resetQuestionForm}>
                          <Plus className="h-4 w-4 mr-2" />
                          Nouvelle question
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Créer une question</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="question">Question</Label>
                            <Input
                              id="question"
                              value={questionForm.question}
                              onChange={(e) => setQuestionForm(prev => ({ ...prev, question: e.target.value }))}
                            />
                          </div>
                          <div>
                            <Label htmlFor="question_type">Type de question</Label>
                            <Select 
                              value={questionForm.question_type} 
                              onValueChange={(value: any) => setQuestionForm(prev => ({ ...prev, question_type: value }))}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="text">Texte</SelectItem>
                                <SelectItem value="select">Sélection</SelectItem>
                                <SelectItem value="multiple_choice">Choix multiple</SelectItem>
                                <SelectItem value="boolean">Oui/Non</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="order_index">Ordre d'affichage</Label>
                            <Input
                              id="order_index"
                              type="number"
                              value={questionForm.order_index}
                              onChange={(e) => setQuestionForm(prev => ({ ...prev, order_index: parseInt(e.target.value) }))}
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="is_required"
                              checked={questionForm.is_required}
                              onCheckedChange={(checked) => setQuestionForm(prev => ({ ...prev, is_required: checked }))}
                            />
                            <Label htmlFor="is_required">Question obligatoire</Label>
                          </div>
                          <Button onClick={handleCreateQuestion} className="w-full">
                            Créer
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {selectedCategory ? (
                  <div className="space-y-4">
                    {questions.filter(q => q.category_id === selectedCategory).map((question) => (
                      <div key={question.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{question.question}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">{question.question_type}</Badge>
                            {question.is_required && (
                              <Badge variant="destructive">Obligatoire</Badge>
                            )}
                            <Badge variant="secondary">Ordre: {question.order_index}</Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => startEditQuestion(question)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteQuestion(question.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Sélectionnez une catégorie pour voir les questions
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Dialog d'édition de question */}
            <Dialog open={!!editingQuestion} onOpenChange={() => setEditingQuestion(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Modifier la question</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="edit-question">Question</Label>
                    <Input
                      id="edit-question"
                      value={questionForm.question}
                      onChange={(e) => setQuestionForm(prev => ({ ...prev, question: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-question_type">Type de question</Label>
                    <Select 
                      value={questionForm.question_type} 
                      onValueChange={(value: any) => setQuestionForm(prev => ({ ...prev, question_type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Texte</SelectItem>
                        <SelectItem value="select">Sélection</SelectItem>
                        <SelectItem value="multiple_choice">Choix multiple</SelectItem>
                        <SelectItem value="boolean">Oui/Non</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="edit-order_index">Ordre d'affichage</Label>
                    <Input
                      id="edit-order_index"
                      type="number"
                      value={questionForm.order_index}
                      onChange={(e) => setQuestionForm(prev => ({ ...prev, order_index: parseInt(e.target.value) }))}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="edit-is_required"
                      checked={questionForm.is_required}
                      onCheckedChange={(checked) => setQuestionForm(prev => ({ ...prev, is_required: checked }))}
                    />
                    <Label htmlFor="edit-is_required">Question obligatoire</Label>
                  </div>
                  <Button onClick={handleUpdateQuestion} className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    Sauvegarder
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};