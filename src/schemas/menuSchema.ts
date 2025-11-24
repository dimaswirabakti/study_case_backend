import { z } from 'zod';

// Schema untuk CREATE (POST) dan UPDATE (PUT)
//  Menggunakan coerce (paksa) untuk memastikan string angka diubah jadi number
export const createMenuSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    category: z.string().min(1, "Category is required"),
    
    // menangani kasus request body yang iseng kirim string
    calories: z.coerce.number().int().nonnegative(), 
    price: z.coerce.number().positive(),
    
    // Array of strings, minimal 1 ingredient
    ingredients: z.array(z.string()).min(1, "At least one ingredient is required"),
    
    description: z.string().min(1, "Description is required"),
  })
});

// Definisi tipe data TypeScript otomatis dari schema di atas
// (Agar tidak perlu buat interface manual lagi)
export type CreateMenuInput = z.infer<typeof createMenuSchema>['body'];