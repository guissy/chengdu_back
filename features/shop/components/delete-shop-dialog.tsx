import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useShopStore } from '@/features/shop-store';
import { useRouter } from 'next/navigation';
import ConfirmDialog from '@/components/ui/confirm-dialog';
import client from "@/lib/api/client";
import type { PostShopDeleteData } from '@/service/types.gen';

const DeleteShopDialog = () => {
  const { isDeleteDialogOpen, closeDeleteDialog, currentShop } = useShopStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();

  // 使用生成的API mutation
  const deleteShopMutation = useMutation({
    mutationFn: (data: PostShopDeleteData) => 
      client.POST("/api/shop/delete", { body: data.body }),
  });

  const handleDelete = async () => {
    if (!currentShop) return;

    try {
      setIsSubmitting(true);
      const body: PostShopDeleteData['body'] = { id: currentShop.shopId };
      await deleteShopMutation.mutateAsync({ body });
      queryClient.invalidateQueries({
        queryKey: ["shopListUnbind"],
      });
      toast.success('商家删除成功');
      closeDeleteDialog();
      router.push('/shop');
    } catch (error) {
      toast.error(`删除商家失败: ${(error as { error: string })?.error}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isDeleteDialogOpen || !currentShop) return null;

  return (
    <ConfirmDialog
      isOpen={isDeleteDialogOpen}
      onClose={closeDeleteDialog}
      title="删除商家"
      message={`确定要删除商家"${currentShop.trademark}${currentShop.branch ? ` (${currentShop.branch})` : ''}"吗？此操作不可恢复。`}
      onConfirm={handleDelete}
      isSubmitting={isSubmitting}
      confirmText="删除"
      confirmVariant="error"
    />
  );
};

export default DeleteShopDialog;
