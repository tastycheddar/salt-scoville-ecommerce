import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Plus, Save, Upload, Image } from 'lucide-react';

import { toast } from 'sonner';
import { useCreateRecipe, useUpdateRecipe } from '@/hooks/useRecipes';

interface AdminRecipeFormProps {
  recipe?: any;
  onClose?: () => void;
  onSave?: () => void;
}

const AdminRecipeForm = ({ recipe, onClose, onSave }: AdminRecipeFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  
  const createRecipe = useCreateRecipe();
  const updateRecipe = useUpdateRecipe();
  const [formData, setFormData] = useState({
    title: recipe?.title || '',
    description: recipe?.description || '',
    video_url: recipe?.video_url || '',
    featured_image: recipe?.featured_image || '',
    heat_level: recipe?.heat_level || 1,
    prep_time: recipe?.prep_time || 0,
    cook_time: recipe?.cook_time || 0,
    servings: recipe?.servings || 1,
    difficulty: recipe?.difficulty || '',
    ingredients: recipe?.ingredients || [{ item: '', amount: '' }],
    instructions: recipe?.instructions || [{ step: 1, instruction: '' }],
    featured_salts: recipe?.featured_salts || [],
    is_featured: recipe?.is_featured || false,
    is_active: recipe?.is_active !== false,
  });

  const [newSalt, setNewSalt] = useState('');

  useEffect(() => {
    if (recipe?.imageUrl) {
      setImagePreview(recipe.imageUrl);
      setFormData(prev => ({ ...prev, featured_image: recipe.imageUrl }));
    }
    if (recipe?.ingredients) {
      setFormData(prev => ({ 
        ...prev, 
        ingredients: recipe.ingredients.length > 0 ? recipe.ingredients : [{ item: '', amount: '' }]
      }));
    }
    if (recipe?.instructions) {
      setFormData(prev => ({ 
        ...prev, 
        instructions: recipe.instructions.length > 0 ? 
          recipe.instructions.map((inst: any, index: number) => ({
            step: index + 1,
            instruction: typeof inst === 'string' ? inst : inst.instruction
          })) : [{ step: 1, instruction: '' }]
      }));
    }
  }, [recipe]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return formData.featured_image || null;

    try {
      const formDataObj = new FormData();
      formDataObj.append('image', imageFile);

      const response = await fetch('/api/upload/recipe-image', {
        method: 'POST',
        body: formDataObj,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      return data.imageUrl;
    } catch (error) {

      return null;
    }
  };

  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { item: '', amount: '' }]
    }));
  };

  const removeIngredient = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const updateIngredient = (index: number, field: 'item' | 'amount', value: string) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((ingredient, i) => 
        i === index ? { ...ingredient, [field]: value } : ingredient
      )
    }));
  };

  const addInstruction = () => {
    setFormData(prev => ({
      ...prev,
      instructions: [...prev.instructions, { 
        step: prev.instructions.length + 1, 
        instruction: '' 
      }]
    }));
  };

  const removeInstruction = (index: number) => {
    setFormData(prev => ({
      ...prev,
      instructions: prev.instructions
        .filter((_, i) => i !== index)
        .map((instruction, i) => ({ ...instruction, step: i + 1 }))
    }));
  };

  const updateInstruction = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      instructions: prev.instructions.map((instruction, i) => 
        i === index ? { ...instruction, instruction: value } : instruction
      )
    }));
  };

  const addSalt = () => {
    if (newSalt.trim() && !formData.featured_salts.includes(newSalt.trim())) {
      setFormData(prev => ({
        ...prev,
        featured_salts: [...prev.featured_salts, newSalt.trim()]
      }));
      setNewSalt('');
    }
  };

  const removeSalt = (saltToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      featured_salts: prev.featured_salts.filter(salt => salt !== saltToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      let featuredImageUrl = formData.featured_image;
      
      if (imageFile) {
        const uploadedUrl = await uploadImage();
        if (uploadedUrl) {
          featuredImageUrl = uploadedUrl;
        }
      }

      // Transform data for Express API
      const recipeData = {
        title: formData.title,
        description: formData.description,
        prepTime: formData.prep_time,
        cookTime: formData.cook_time,
        servings: formData.servings,
        difficulty: formData.difficulty,
        instructions: formData.instructions.map(inst => inst.instruction).filter(inst => inst.trim()),
        imageUrl: featuredImageUrl,
        tags: formData.featured_salts || [],
        spiceLevel: 'medium', // Default for now, could add heat level mapping
        isPublished: formData.is_active
      };

      if (recipe?.id) {
        await updateRecipe.mutateAsync({ id: recipe.id, data: recipeData });
      } else {
        await createRecipe.mutateAsync(recipeData);
      }

      onSave?.();
      onClose?.();
      
    } catch (error: any) {
      console.error('Recipe save error:', error);
      // Error handling is done by the mutation hooks
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {recipe ? 'Edit Recipe' : 'Create New Recipe'}
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload Section */}
            <div className="space-y-4">
              <Label>Recipe Image</Label>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <Label 
                    htmlFor="image-upload"
                    className="flex items-center gap-2 cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-gray-400 transition-colors"
                  >
                    <Upload className="h-5 w-5" />
                    {imageFile ? imageFile.name : 'Upload recipe image'}
                  </Label>
                </div>
                {imagePreview && (
                  <div className="w-24 h-24 rounded-lg overflow-hidden border">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Recipe Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter recipe title"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="heat_level">Heat Level</Label>
                <Select 
                  value={formData.heat_level.toString()} 
                  onValueChange={(value) => 
                    setFormData(prev => ({ ...prev, heat_level: parseInt(value) }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">🌶️ Mild (1)</SelectItem>
                    <SelectItem value="2">🌶️🌶️ Medium (2)</SelectItem>
                    <SelectItem value="3">🌶️🌶️🌶️ Hot (3)</SelectItem>
                    <SelectItem value="4">🌶️🌶️🌶️🌶️ Very Hot (4)</SelectItem>
                    <SelectItem value="5">🌶️🌶️🌶️🌶️🌶️ Extreme (5)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your recipe..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="video_url">Video URL</Label>
                <Input
                  id="video_url"
                  value={formData.video_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, video_url: e.target.value }))}
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>
              <div>
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select 
                  value={formData.difficulty} 
                  onValueChange={(value) => 
                    setFormData(prev => ({ ...prev, difficulty: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Recipe Times and Servings */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="prep_time">Prep Time (min)</Label>
                <Input
                  id="prep_time"
                  type="number"
                  value={formData.prep_time}
                  onChange={(e) => setFormData(prev => ({ ...prev, prep_time: parseInt(e.target.value) }))}
                />
              </div>
              <div>
                <Label htmlFor="cook_time">Cook Time (min)</Label>
                <Input
                  id="cook_time"
                  type="number"
                  value={formData.cook_time}
                  onChange={(e) => setFormData(prev => ({ ...prev, cook_time: parseInt(e.target.value) }))}
                />
              </div>
              <div>
                <Label htmlFor="servings">Servings</Label>
                <Input
                  id="servings"
                  type="number"
                  value={formData.servings}
                  onChange={(e) => setFormData(prev => ({ ...prev, servings: parseInt(e.target.value) }))}
                />
              </div>
            </div>

            {/* Status Controls */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                  className="rounded"
                />
                <Label htmlFor="is_active">Active Recipe</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_featured"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
                  className="rounded"
                />
                <Label htmlFor="is_featured">Featured Recipe</Label>
              </div>
            </div>

            {/* Ingredients Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <Label>Ingredients</Label>
                <Button
                  type="button"
                  onClick={addIngredient}
                  size="sm"
                  variant="outline"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Ingredient
                </Button>
              </div>
              
              <div className="space-y-3">
                {formData.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex gap-3 items-end">
                    <div className="flex-1">
                      <Input
                        value={ingredient.amount}
                        onChange={(e) => updateIngredient(index, 'amount', e.target.value)}
                        placeholder="Amount"
                      />
                    </div>
                    <div className="flex-2">
                      <Input
                        value={ingredient.item}
                        onChange={(e) => updateIngredient(index, 'item', e.target.value)}
                        placeholder="Ingredient"
                      />
                    </div>
                    {formData.ingredients.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeIngredient(index)}
                        size="sm"
                        variant="outline"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <Label>Instructions</Label>
                <Button
                  type="button"
                  onClick={addInstruction}
                  size="sm"
                  variant="outline"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Step
                </Button>
              </div>
              
              <div className="space-y-3">
                {formData.instructions.map((instruction, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold mt-1">
                      {instruction.step}
                    </div>
                    <div className="flex-1">
                      <Textarea
                        value={instruction.instruction}
                        onChange={(e) => updateInstruction(index, e.target.value)}
                        placeholder="Enter instruction step..."
                      />
                    </div>
                    {formData.instructions.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeInstruction(index)}
                        size="sm"
                        variant="outline"
                        className="mt-1"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Featured Salts */}
            <div>
              <Label>Featured Salt Products</Label>
              <div className="flex gap-2 mt-2 mb-3">
                <Input
                  value={newSalt}
                  onChange={(e) => setNewSalt(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSalt())}
                  placeholder="Which Salt & Scoville products work best?"
                />
                <Button type="button" onClick={addSalt} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {formData.featured_salts.map((salt, index) => (
                  <Badge key={index} variant="secondary">
                    {salt}
                    <button
                      type="button"
                      onClick={() => removeSalt(salt)}
                      className="ml-2 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-6 border-t">
              {onClose && (
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
              )}
              <Button type="submit" disabled={isSubmitting}>
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? 'Saving...' : 'Save Recipe'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminRecipeForm;
