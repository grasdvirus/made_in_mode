
'use server';

import fs from 'fs/promises';
import path from 'path';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const ordersDataFilePath = path.join(process.cwd(), 'public/orders.json');

const OrderItemSchema = z.object({
    id: z.string(),
    name: z.string(),
    quantity: z.number(),
    price: z.number(),
    size: z.string(),
    color: z.string(),
});

const OrderStatusSchema = z.enum(['En attente', 'Traitée', 'Annulée']);

const OrderSchema = z.object({
  id: z.string(),
  date: z.string(),
  status: OrderStatusSchema,
  fullName: z.string(),
  phone: z.string(),
  address: z.string(),
  transactionId: z.string(),
  cartItems: z.array(OrderItemSchema),
  total: z.number(),
});

export type Order = z.infer<typeof OrderSchema>;
export type OrderStatus = z.infer<typeof OrderStatusSchema>;

async function readOrders(): Promise<Order[]> {
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
    await fs.writeFile(ordersDataFilePath, JSON.stringify(orders, null, 2));
    revalidatePath('/admin/orders');
}

export async function getOrders(): Promise<Order[]> {
    return await readOrders();
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<{ success: boolean; message?: string }> {
    try {
        const orders = await readOrders();
        const orderIndex = orders.findIndex(o => o.id === orderId);

        if (orderIndex === -1) {
            return { success: false, message: 'Commande non trouvée.' };
        }

        orders[orderIndex].status = status;
        await writeOrders(orders);
        
        return { success: true };

    } catch (error) {
        console.error("Failed to update order status:", error);
        return { success: false, message: 'Une erreur technique est survenue.' };
    }
}
