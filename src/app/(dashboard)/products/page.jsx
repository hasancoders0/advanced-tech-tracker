"use client";

import { useMemo, useState } from "react";
import { Edit, Eye, Package, Plus, Trash2 } from "lucide-react";

import PageHeader from "@/components/common/PageHeader";
import SearchInput from "@/components/common/SearchInput";
import DataTable from "@/components/common/DataTable";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import StatCard from "@/components/common/StatCard";

import productsData from "@/data/master/items";

export default function ProductsPage() {
  const [products, setProducts] = useState(productsData);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        product.id
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || product.category === category;

      const matchesStatus =
        status === "All" || product.status === status;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, search, category, status]);

  const activeProducts = products.filter(
    (product) => product.status === "Active"
  ).length;

  const serviceCount = products.filter(
    (product) => product.category === "Service"
  ).length;

  const productCount = products.filter(
    (product) => product.category === "Product"
  ).length;

  function handleDelete(id) {
    setProducts((current) =>
      current.filter((product) => product.id !== id)
    );
  }

  const columns = [
    {
      key: "name",
      label: "Product / Service",
      render: (row) => (
        <div>
          <p className="font-medium text-slate-900">
            {row.name}
          </p>
          <p className="text-xs text-slate-400">
            {row.id}
          </p>
        </div>
      ),
    },
    {
      key: "category",
      label: "Category",
      render: (row) => (
        <Badge
          variant={
            row.category === "Service"
              ? "info"
              : "default"
          }
        >
          {row.category}
        </Badge>
      ),
    },
    {
      key: "description",
      label: "Description",
    },
    {
      key: "price",
      label: "Price",
      render: (row) => `$${row.price.toFixed(2)}`,
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <Badge
          variant={
            row.status === "Active"
              ? "success"
              : "default"
          }
        >
          {row.status}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex items-center gap-1">
          <button
            className="rounded-md p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            title="View"
          >
            <Eye size={16} />
          </button>

          <button
            className="rounded-md p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            title="Edit"
          >
            <Edit size={16} />
          </button>

          <button
            onClick={() => handleDelete(row.id)}
            className="rounded-md p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products & Services"
        description="Manage products and services used across the tracker."
        actionLabel="Add Product / Service"
        onAction={() => setModalOpen(true)}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Items"
          value={products.length}
          icon={Package}
        />

        <StatCard
          title="Active Items"
          value={activeProducts}
          icon={Package}
        />

        <StatCard
          title="Products"
          value={productCount}
          icon={Package}
        />

        <StatCard
          title="Services"
          value={serviceCount}
          icon={Package}
        />
      </div>

      <div className="flex flex-col gap-3 lg:flex-row">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search products or services..."
          className="flex-1"
        />

        <div className="w-full lg:w-48">
          <Select
            value={category}
            onChange={setCategory}
            options={[
              { value: "All", label: "All Categories" },
              { value: "Product", label: "Products" },
              { value: "Service", label: "Services" },
            ]}
          />
        </div>

        <div className="w-full lg:w-40">
          <Select
            value={status}
            onChange={setStatus}
            options={[
              { value: "All", label: "All Statuses" },
              { value: "Active", label: "Active" },
              { value: "Inactive", label: "Inactive" },
            ]}
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredProducts}
        getRowKey={(row) => row.id}
        emptyMessage="No products or services found."
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Product / Service"
        description="Create a new product or service."
      >
        <div className="space-y-4">
          <Input
            id="product-name"
            label="Name"
            placeholder="Enter name"
          />

          <Select
            id="product-category"
            label="Category"
            options={[
              { value: "Product", label: "Product" },
              { value: "Service", label: "Service" },
            ]}
          />

          <Input
            id="product-price"
            label="Price"
            type="number"
            placeholder="0.00"
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>

            <Button
              onClick={() => setModalOpen(false)}
            >
              <Plus size={16} />
              Save
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
