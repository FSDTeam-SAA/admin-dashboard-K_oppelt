'use client';

import React from "react"

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { apiClient } from '@/lib/api';
import { SubscriptionPlan } from '@/lib/types';
import { toast } from 'sonner';

export default function SubscriptionsPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    priceMonth: '',
    priceYear: '',
  });
  const [editFormData, setEditFormData] = useState({
    name: '',
    priceMonth: '',
    priceYear: '',
  });

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      setIsLoading(true);
      const data = await apiClient.getSubscriptionPlans();
      const rawPlans = Array.isArray(data) ? data : data?.data ?? [];
      const normalizedPlans = rawPlans.map((plan: any) => ({
        id: plan?._id ?? plan?.id ?? '',
        name: plan?.name ?? '',
        priceMonth: plan?.priceMonthly ?? plan?.priceMonth ?? plan?.price ?? undefined,
        priceYear: plan?.priceYearly ?? plan?.priceYear ?? undefined,
        description: plan?.description ?? '',
        isActive: plan?.isActive ?? true,
        createdAt: plan?.createdAt ?? '',
      }));
      setPlans(normalizedPlans);
    } catch (error) {
      console.error('Failed to load plans:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPlan = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.priceMonth || !formData.priceYear) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await apiClient.createSubscriptionPlan({
        name: formData.name,
        priceMonth: parseFloat(formData.priceMonth),
        priceYear: parseFloat(formData.priceYear),
      });
      
      setFormData({ name: '', priceMonth: '', priceYear: '' });
      setShowModal(false);
      await loadPlans();
    } catch (error) {
      console.error('Failed to create plan:', error);
    }
  };

  const openEditModal = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setEditFormData({
      name: plan.name || '',
      priceMonth: plan.priceMonth ? String(plan.priceMonth) : '',
      priceYear: plan.priceYear ? String(plan.priceYear) : '',
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setShowDeleteModal(true);
  };

  const handleEditPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;

    if (!editFormData.name || !editFormData.priceMonth || !editFormData.priceYear) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await apiClient.updateSubscriptionPlan(selectedPlan.id, {
        name: editFormData.name,
        priceMonth: parseFloat(editFormData.priceMonth),
        priceYear: parseFloat(editFormData.priceYear),
      });
      setShowEditModal(false);
      setSelectedPlan(null);
      await loadPlans();
    } catch (error) {
      console.error('Failed to update plan:', error);
    }
  };

  const handleDeletePlan = async () => {
    if (!selectedPlan) return;
    try {
      await apiClient.toggleSubscriptionPlan(selectedPlan.id, 'delete');
      setShowDeleteModal(false);
      setSelectedPlan(null);
      await loadPlans();
    } catch (error) {
      console.error('Failed to delete plan:', error);
    }
  };

  return (
    <div className="p-8 bg-gradient-to-br from-background via-background to-secondary/5 min-h-screen">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-1">Flexible Plan</h1>
            <p className="text-muted-foreground">Create a plan that works best for you</p>
          </div>
          <Button
            className="bg-primary text-white hover:bg-primary/90"
            onClick={() => setShowModal(true)}
          >
            + Add New Plan
          </Button>
        </div>

        {/* Plans Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="h-6 bg-muted rounded w-1/2 mb-4"></div>
                <div className="h-12 bg-muted rounded mb-4"></div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plans.map((plan) => (
              <Card key={plan.id} className="p-6 hover:shadow-lg transition-shadow">
                {/* Decorative Wave */}
                <div className="h-16 bg-gradient-to-r from-primary to-accent rounded-lg mb-4 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-r from-primary/20 to-accent/20"></div>
                </div>

                <h3 className="text-2xl font-bold text-foreground mb-4">{plan.name}</h3>

                <div className="space-y-4 mb-6">
                  {plan.priceMonth !== undefined && plan.priceMonth !== null && (
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-foreground">
                        ${plan.priceMonth.toFixed(2)}
                      </span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                  )}
                  {plan.priceYear !== undefined && plan.priceYear !== null && (
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-foreground">
                        ${plan.priceYear.toFixed(2)}
                      </span>
                      <span className="text-muted-foreground">/year</span>
                    </div>
                  )}
                </div>

                <p className="text-muted-foreground text-sm mb-6">
                  Better for large team or company
                </p>

                <div className="border-t border-border pt-6 flex gap-3">
                  <Button
                    variant="default"
                    className="flex-1 bg-primary text-white hover:bg-primary/90"
                    onClick={() => openEditModal(plan)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => openDeleteModal(plan)}
                  >
                   Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Add Plan Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md p-6">
              <h2 className="text-2xl font-bold text-foreground mb-6">Create New Subscription Plan</h2>
              
              <form onSubmit={handleAddPlan} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Subscription Plan Name
                  </label>
                  <Input
                    placeholder="Premium"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Price for Month
                  </label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={formData.priceMonth}
                    onChange={(e) => setFormData({ ...formData, priceMonth: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Price for Year
                  </label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={formData.priceYear}
                    onChange={(e) => setFormData({ ...formData, priceYear: e.target.value })}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 bg-primary text-white hover:bg-primary/90"
                  >
                    Save
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => {
                      setShowModal(false);
                      setFormData({ name: '', priceMonth: '', priceYear: '' });
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}

        {/* Edit Plan Modal */}
        {showEditModal && selectedPlan && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md p-6">
              <h2 className="text-2xl font-bold text-foreground mb-6">Edit Subscription Plan</h2>

              <form onSubmit={handleEditPlan} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Subscription Plan Name
                  </label>
                  <Input
                    placeholder="Premium"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Price for Month
                  </label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={editFormData.priceMonth}
                    onChange={(e) => setEditFormData({ ...editFormData, priceMonth: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Price for Year
                  </label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={editFormData.priceYear}
                    onChange={(e) => setEditFormData({ ...editFormData, priceYear: e.target.value })}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 bg-primary text-white hover:bg-primary/90"
                  >
                    Save
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedPlan(null);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}

        {/* Delete Plan Modal */}
        {showDeleteModal && selectedPlan && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md p-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">Delete Plan</h2>
              <p className="text-muted-foreground mb-6">
                Are you sure you want to delete <span className="font-semibold text-foreground">{selectedPlan.name}</span>?
              </p>
              <div className="flex gap-3">
                <Button
                  className="flex-1 bg-primary text-white hover:bg-primary/90"
                  onClick={handleDeletePlan}
                >
                  Yes
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedPlan(null);
                  }}
                >
                  No
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
