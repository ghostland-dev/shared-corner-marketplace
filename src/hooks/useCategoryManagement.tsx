import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CategoryQuestion {
  id: string;
  category_id: string;
  question: string;
  question_type: 'text' | 'select' | 'multiple_choice' | 'boolean';
  options?: any;
  is_required: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export const useCategoryManagement = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [questions, setQuestions] = useState<CategoryQuestion[]>([]);
  const [loading, setLoading] = useState(false);

  // Charger les catégories
  const loadCategories = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les catégories",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Charger les questions d'une catégorie
  const loadQuestions = async (categoryId?: string) => {
    try {
      let query = supabase
        .from('category_questions')
        .select('*')
        .order('order_index');

      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setQuestions(data || []);
    } catch (error) {
      console.error('Error loading questions:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les questions",
        variant: "destructive",
      });
    }
  };

  // Créer une catégorie
  const createCategory = async (category: Omit<Category, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([category])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Catégorie créée",
        description: "La catégorie a été créée avec succès",
      });

      await loadCategories();
      return data;
    } catch (error) {
      console.error('Error creating category:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la catégorie",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Mettre à jour une catégorie
  const updateCategory = async (id: string, updates: Partial<Category>) => {
    try {
      const { error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Catégorie mise à jour",
        description: "La catégorie a été mise à jour avec succès",
      });

      await loadCategories();
    } catch (error) {
      console.error('Error updating category:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la catégorie",
        variant: "destructive",
      });
    }
  };

  // Supprimer une catégorie
  const deleteCategory = async (id: string) => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Catégorie supprimée",
        description: "La catégorie a été supprimée avec succès",
      });

      await loadCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la catégorie",
        variant: "destructive",
      });
    }
  };

  // Créer une question
  const createQuestion = async (question: Omit<CategoryQuestion, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('category_questions')
        .insert([question])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Question créée",
        description: "La question a été créée avec succès",
      });

      await loadQuestions(question.category_id);
      return data;
    } catch (error) {
      console.error('Error creating question:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la question",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Mettre à jour une question
  const updateQuestion = async (id: string, updates: Partial<CategoryQuestion>) => {
    try {
      const { error } = await supabase
        .from('category_questions')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Question mise à jour",
        description: "La question a été mise à jour avec succès",
      });

      const currentQuestion = questions.find(q => q.id === id);
      if (currentQuestion) {
        await loadQuestions(currentQuestion.category_id);
      }
    } catch (error) {
      console.error('Error updating question:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la question",
        variant: "destructive",
      });
    }
  };

  // Supprimer une question
  const deleteQuestion = async (id: string) => {
    try {
      const currentQuestion = questions.find(q => q.id === id);
      
      const { error } = await supabase
        .from('category_questions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Question supprimée",
        description: "La question a été supprimée avec succès",
      });

      if (currentQuestion) {
        await loadQuestions(currentQuestion.category_id);
      }
    } catch (error) {
      console.error('Error deleting question:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la question",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return {
    categories,
    questions,
    loading,
    loadCategories,
    loadQuestions,
    createCategory,
    updateCategory,
    deleteCategory,
    createQuestion,
    updateQuestion,
    deleteQuestion,
  };
};