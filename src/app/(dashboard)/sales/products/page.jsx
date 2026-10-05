"use client";

import { useEffect, useMemo, useState } from "react";

import { Cog, Package, ShoppingBag, Wrench } from "lucide-react";

import PageHeader from "@/components/common/PageHeader";
import SearchInput from "@/components/common/SearchInput";
import StatCard from "@/components/common/StatCard";
import Pagination from "@/components/common/Pagination";

import Select from "@/components/ui/Select";

import ProductForm from "@/components/products/ProductForm";
import ProductTable from "@/components/products/ProductTable";

import EquipmentForm from "@/components/products/EquipmentForm";
import EquipmentTable from "@/components/products/EquipmentTable";

import productsData from "@/data/master/products";
import equipmentData from "@/data/master/equipment";

const PAGE_SIZE = 7;

function generateId(items, prefix) {
  const numbers = items
    .map((item) => {
      const match = String(item.id || "").match(
        new RegExp(`^${prefix}-(\\d+)$`, "i"),
      );

      return match ? Number(match[1]) : 0;
    })
    .filter(Boolean);

  const highest = numbers.length ? Math.max(...numbers) : 0;

  return `${prefix}-${String(highest + 1).padStart(3, "0")}`;
}

export default function ProductsPage() {
  const [activeTab, setActiveTab] = useState("products");

  const [products, setProducts] = useState(productsData || []);

  const [equipment, setEquipment] = useState(equipmentData || []);

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("all");

  const [status, setStatus] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);

  const [editingItem, setEditingItem] = useState(null);

  /* =====================================================
     RESET PAGINATION
  ===================================================== */

  useEffect(() => {
    setCurrentPage(1);
  }, [search, category, status, activeTab]);

  /* =====================================================
     CURRENT DATA
  ===================================================== */

  const currentData = activeTab === "products" ? products : equipment;

  /* =====================================================
     CATEGORIES
  ===================================================== */

  const categoryOptions = useMemo(() => {
    const categories = Array.from(
      new Set(currentData.map((item) => item.category).filter(Boolean)),
    ).sort();

    return [
      {
        value: "all",
        label: "All Categories",
      },

      ...categories.map((item) => ({
        value: item,
        label: item,
      })),
    ];
  }, [currentData]);

  /* =====================================================
     FILTERED DATA
  ===================================================== */

  const filteredData = useMemo(() => {
    const query = search.trim().toLowerCase();

    return currentData.filter((item) => {
      const searchable =
        activeTab === "products"
          ? [item.name, item.sku, item.category, item.notes]
          : [item.name, item.id, item.category, item.notes];

      const matchesSearch =
        !query ||
        searchable.some((value) =>
          String(value || "")
            .toLowerCase()
            .includes(query),
        );

      const matchesCategory = category === "all" || item.category === category;

      const matchesStatus = status === "all" || item.status === status;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [currentData, search, category, status, activeTab]);

  /* =====================================================
     PAGINATION
  ===================================================== */

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;

    return filteredData.slice(start, start + PAGE_SIZE);
  }, [filteredData, currentPage]);

  /* =====================================================
     STATS
  ===================================================== */

  const stats = useMemo(() => {
    const items = currentData;

    const active = items.filter((item) => item.status === "Active").length;

    const inactive = items.filter((item) => item.status === "Inactive").length;

    const categories = new Set(items.map((item) => item.category)).size;

    return {
      total: items.length,
      active,
      inactive,
      categories,
    };
  }, [currentData]);

  /* =====================================================
     ADD PRODUCT
  ===================================================== */

  async function handleAddProduct(data) {
    const newProduct = {
      id: generateId(products, "PROD"),

      ...data,

      createdDate: new Date().toISOString().slice(0, 10),
    };

    setProducts((current) => [newProduct, ...current]);
  }

  /* =====================================================
     ADD EQUIPMENT
  ===================================================== */

  async function handleAddEquipment(data) {
    const newEquipment = {
      id: generateId(equipment, "EQUIP"),

      ...data,

      createdDate: new Date().toISOString().slice(0, 10),
    };

    setEquipment((current) => [newEquipment, ...current]);
  }

  /* =====================================================
     EDIT
  ===================================================== */

  function handleEdit(item) {
    setEditingItem(item);
  }

  function closeEdit() {
    setEditingItem(null);
  }

  async function handleUpdateProduct(data) {
    setProducts((current) =>
      current.map((item) =>
        item.id === editingItem.id
          ? {
              ...item,
              ...data,
            }
          : item,
      ),
    );

    closeEdit();
  }

  async function handleUpdateEquipment(data) {
    setEquipment((current) =>
      current.map((item) =>
        item.id === editingItem.id
          ? {
              ...item,
              ...data,
            }
          : item,
      ),
    );

    closeEdit();
  }

  /* =====================================================
     DELETE
  ===================================================== */

  function handleDelete(item) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${item.name}"?`,
    );

    if (!confirmed) {
      return;
    }

    if (activeTab === "products") {
      setProducts((current) =>
        current.filter((product) => product.id !== item.id),
      );
    } else {
      setEquipment((current) =>
        current.filter((equipmentItem) => equipmentItem.id !== item.id),
      );
    }
  }

  /* =====================================================
     VIEW
  ===================================================== */

  function handleView(item) {
    const details =
      activeTab === "products"
        ? [
            `Product: ${item.name}`,
            `SKU: ${item.sku}`,
            `Category: ${item.category}`,
            `Price: $${Number(item.price || 0).toFixed(2)}`,
            `Cost: $${Number(item.cost || 0).toFixed(2)}`,
            `Status: ${item.status}`,
          ]
        : [
            `Equipment: ${item.name}`,
            `ID: ${item.id}`,
            `Category: ${item.category}`,
            `Price: $${Number(item.price || 0).toFixed(2)}`,
            `Status: ${item.status}`,
          ];

    window.alert(details.join("\n"));
  }

  function handleTabChange(tab) {
    setActiveTab(tab);
    setSearch("");
    setCategory("all");
    setStatus("all");
    setCurrentPage(1);
    setEditingItem(null);
  }

  const isEditing = Boolean(editingItem);

  return (
    <div className="space-y-4">
      {/* Header */}

      <PageHeader
        title="Products & Equipment"
        description="Manage products and equipment used across sales and service operations."
      />

      {/* Summary */}

      <div className="grid grid-cols-2 gap-2.5 xl:grid-cols-4">
        <StatCard
          title="Products"
          value={products.length}
          description="Product records"
          icon={Package}
        />

        <StatCard
          title="Equipment"
          value={equipment.length}
          description="Equipment records"
          icon={Cog}
        />

        <StatCard
          title="Active Products"
          value={products.filter((item) => item.status === "Active").length}
          description="Available products"
          icon={ShoppingBag}
        />

        <StatCard
          title="Active Equipment"
          value={equipment.filter((item) => item.status === "Active").length}
          description="Available equipment"
          icon={Wrench}
        />
      </div>

      {/* Tabs */}

      <div className="grid grid-cols-2 rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
        <button
          type="button"
          onClick={() => handleTabChange("products")}
          className={[
            "flex h-9 items-center justify-center gap-2 rounded-lg text-xs font-medium transition",
            activeTab === "products"
              ? "bg-slate-900 text-white"
              : "text-slate-500 hover:bg-slate-50 hover:text-slate-800",
          ].join(" ")}
        >
          <Package size={14} />
          Products
        </button>

        <button
          type="button"
          onClick={() => handleTabChange("equipment")}
          className={[
            "flex h-9 items-center justify-center gap-2 rounded-lg text-xs font-medium transition",
            activeTab === "equipment"
              ? "bg-slate-900 text-white"
              : "text-slate-500 hover:bg-slate-50 hover:text-slate-800",
          ].join(" ")}
        >
          <Cog size={14} />
          Equipment
        </button>
      </div>

      {/* Main 50 / 50 Layout */}

      <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-2">
        {/* LEFT */}

        <div className="min-w-0">
          {activeTab === "products" ? (
            <ProductForm
              initialProduct={isEditing ? editingItem : null}
              mode={isEditing ? "edit" : "add"}
              onSubmit={isEditing ? handleUpdateProduct : handleAddProduct}
              onCancel={closeEdit}
            />
          ) : (
            <EquipmentForm
              initialEquipment={isEditing ? editingItem : null}
              mode={isEditing ? "edit" : "add"}
              onSubmit={isEditing ? handleUpdateEquipment : handleAddEquipment}
              onCancel={closeEdit}
            />
          )}
        </div>

        {/* RIGHT */}

        <div className="min-w-0 space-y-3">
          {/* Search / Filter */}

          <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_190px_160px]">
              <SearchInput
                value={search}
                onChange={setSearch}
                placeholder={
                  activeTab === "products"
                    ? "Search product, SKU or category..."
                    : "Search equipment or category..."
                }
              />

              <Select
                label="Category"
                value={category}
                onChange={setCategory}
                options={categoryOptions}
              />

              <Select
                label="Status"
                value={status}
                onChange={setStatus}
                options={[
                  {
                    value: "all",
                    label: "All Statuses",
                  },
                  {
                    value: "Active",
                    label: "Active",
                  },
                  {
                    value: "Inactive",
                    label: "Inactive",
                  },
                ]}
              />
            </div>
          </div>

          {/* List */}

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-4 py-3">
              <h2 className="text-sm font-semibold text-slate-800">
                {activeTab === "products" ? "Products" : "Equipment"}
              </h2>

              <p className="mt-0.5 text-[10px] text-slate-400">
                {filteredData.length}{" "}
                {filteredData.length === 1 ? "item" : "items"} found
              </p>
            </div>

            {activeTab === "products" ? (
              <ProductTable
                products={paginatedData}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ) : (
              <EquipmentTable
                equipment={paginatedData}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}

            <Pagination
              currentPage={currentPage}
              totalItems={filteredData.length}
              pageSize={PAGE_SIZE}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
