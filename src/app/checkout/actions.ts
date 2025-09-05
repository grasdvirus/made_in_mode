
'use server';

import fs from 'fs/promises';
import path from 'path';
import { z } from 'zod';
import { type CartItem } from '@/hooks/use-cart';

const dataDir = path.join(process.cwd(), 'src/data');
const ordersDataFilePath = path.join(dataDir, 'orders.json');


const OrderItemSchema = z.object({
    id: z.string(),
    name: z.string(),
    quantity: z.number(),
    price: z.number(),
    size: z.string(),
    color: z.string(),
});

const OrderSchema = z.object({
  id: z.string(),
  date: z.string(),
  status: z.enum(['En attente', 'Traitée', 'Annulée']),
  fullName: z.string(),
  phone: z.string(),
  address: z.string(),
  transactionId: z.string(),
  cartItems: z.array(OrderItemSchema),
  total: z.number(),
});

export type Order = z.infer<typeof OrderSchema>;

async function ensureDataDirExists() {
    try {
        await fs.access(dataDir);
    } catch (e) {
        await fs.mkdir(dataDir, { recursive: true });
    }
}

async function readOrders(): Promise<Order[]> {
    await ensureDataDirExists();
    try {
        const fileContent = await fs.readFile(ordersDataFilePath, 'utf-8');
        return OrderSchema.array().parse(JSON.parse(fileContent));
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            await fs.writeFile(ordersDataFilePath, '[]');
            return [];
        }
        console.error("Failed to read orders file:", error);
        return [];
    }
}

async function writeOrders(orders: Order[]) {
    await ensureDataDirExists();
    await fs.writeFile(ordersDataFilePath, JSON.stringify(orders, null, 2));
}

export async function submitOrder(orderData: {
  fullName: string;
  phone: string;
  address: string;
  transactionId: string;
  cartItems: CartItem[];
  total: number;
}): Promise<{ success: boolean; message?: string }> {
  
    try {
        const orders = await readOrders();

        const newOrder: Order = {
            id: new Date().getTime().toString(),
            date: new Date().toISOString(),
            status: 'En attente',
            ...orderData,
            cartItems: orderData.cartItems.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                size: item.size,
                color: item.color
            }))
        };
        
        // Use zod to validate the new order before writing
        OrderSchema.parse(newOrder);

        const updatedOrders = [newOrder, ...orders];
        await writeOrders(updatedOrders);
        
        return { success: true };

    } catch (error) {
        console.error("Failed to submit order:", error);
        if (error instanceof z.ZodError) {
             return { success: false, message: `Erreur de validation: ${error.errors.map(e => `${e.path.join('.')} - ${e.message}`).join(', ')}` };
        }
        return { success: false, message: 'Une erreur technique est survenue.' };
    }
}
