"use client";

import { useEffect, useMemo, useState } from "react";
import { Package, Wrench, X } from "lucide-react";

import ProductSaleForm from "@/components/sales/ProductSaleForm";
import ServiceSaleForm from "@/components/sales/ServiceSaleForm";

const CUSTOMERS = [
  {
    id: "customer-001",
    name: "John Smith",
    phone: "(555) 201-1001",
  },
  {
    id: "customer-002",
    name: "Robert Johnson",
    phone: "(555) 201-1002",
  },
  {
    id: "customer-003",
    name: "Michael Williams",
    phone: "(555) 201-1003",
  },
  {
    id: "customer-004",
    name: "David Brown",
    phone: "(555) 201-1004",
  },
  {
    id: "customer-005",
    name: "James Davis",
    phone: "(555) 201-1005",
  },
  {
    id: "customer-006",
    name: "Sarah Miller",
    phone: "(555) 201-1006",
  },
];

const ITEMS = [
  {
    id: "item-001",
    name: "Brake Service",
    type: "product",
    price: 185,
    category: "Automotive",
  },
  {
    id: "item-002",
    name: "Oil Change",
    type: "product",
    price: 95,
    category: "Automotive",
  },
  {
    id: "item-003",
    name: "Brake Pad",
    type: "product",
    price: 85,
    category: "Automotive",
  },
  {
    id: "item-004",
    name: "AC Filter",
    type: "product",
    price: 45,
    category: "HVAC",
  },
  {
    id: "item-005",
    name: "Diagnostic Service",
    type: "service",
    price: 125,
    category: "Service",
  },
  {
    id: "item-006",
    name: "HVAC Repair",
    type: "service",
    price: 150,
    category: "HVAC",
  },
  {
    id: "item-007",
    name: "HVAC Maintenance",
    type: "service",
    price: 175,
    category: "HVAC",
  },
  {
    id: "item-008",
    name: "AC Installation",
    type: "service",
    price: 450,
    category: "HVAC",
  },
];

const EQUIPMENT = [
  {
    id: "equipment-001",
    name: "AC Filter",
    category: "HVAC",
    price: 45,
  },
  {
    id: "equipment-002",
    name: "Refrigerant",
    category: "HVAC",
    price: 35,
  },
  {
    id: "equipment-003",
    name: "Copper Pipe",
    category: "HVAC",
    price: 12,
  },
  {
    id: "equipment-004",
    name: "Brake Pad Set",
    category: "Automotive",
    price: 85,
  },
  {
    id: "equipment-005",
    name: "Engine Oil",
    category: "Automotive",
    price: 40,
  },
];

const TECHNICIANS = [
  {
    id: "tech-002",
    name: "Deomar Contreras",
  },
  {
    id: "tech-003",
    name: "Alan Rivera",
  },
  {
    id: "tech-004",
    name: "Roberto Lopez Jr",
  },
  {
    id: "tech-011",
    name: "Mike Memmel",
  },
  {
    id: "tech-012",
    name: "Roberto Lopez",
  },
  {
    id: "tech-013",
    name: "Trevor McCarty",
  },
  {
    id: "tech-014",
    name: "Julio Alatorre",
  },
  {
    id: "tech-015",
    name: "Rob Kile",
  },
  {
    id: "tech-016",
    name: "Joe Rascon",
  },
];

const SALESPERSONS = [
  {
    id: "user-001",
    name: "Administrator",
  },
  {
    id: "user-002",
    name: "Jack Vanderbilt",
  },
  {
    id: "user-003",
    name: "Joseph Vanderbilt",
  },
  {
    id: "user-004",
    name: "Easton Meier",
  },
  {
    id: "user-005",
    name: "Roberta Christie",
  },
  {
    id: "user-006",
    name: "Eric Clark",
  },
];

function createProductSale() {
  return {
    type: "product",
    id: "",
    customerId: "",
    customerName: "",
    isCustomCustomer: false,
    itemId: "",
    itemName: "",
    isCustomProduct: false,
    quantity: 1,
    unitPrice: 0,
    discount: 0,
    tax: 0,
    salespersonId: "",
    salespersonName: "",
    paymentMethod: "Cash",
    paymentStatus: "Pending",
    notes: "",
  };
}

function createServiceSale() {
  return {
    type: "service",
    id: "",
    customerId: "",
    customerName: "",
    isCustomCustomer: false,
    serviceId: "",
    serviceName: "",
    isCustomService: false,
    equipment: [],
    serviceCharge: 0,
    discount: 0,
    tax: 0,
    technicianId: "",
    technicianName: "",
    salespersonId: "",
    salespersonName: "",
    paymentMethod: "Cash",
    paymentStatus: "Pending",
    notes: "",
  };
}

function getSaleType(sale) {
  return sale?.type === "service" ? "service" : "product";
}

function hydrateProductSale(initialSale) {
  return {
    ...createProductSale(),
    id: initialSale?.id || "",
    type: "product",
    customerId: initialSale?.customerId || "",
    customerName:
      initialSale?.customerName ||
      initialSale?.customer ||
      "",
    isCustomCustomer:
      initialSale?.isCustomCustomer || false,
    itemId: initialSale?.itemId || "",
    itemName:
      initialSale?.itemName ||
      initialSale?.item ||
      "",
    isCustomProduct:
      initialSale?.isCustomProduct || false,
    quantity: initialSale?.quantity ?? 1,
    unitPrice: initialSale?.unitPrice ?? 0,
    discount: initialSale?.discount ?? 0,
    tax: initialSale?.tax ?? 0,
    salespersonId:
      initialSale?.salespersonId || "",
    salespersonName:
      initialSale?.salespersonName ||
      initialSale?.salesperson ||
      "",
    paymentMethod:
      initialSale?.paymentMethod ||
      "Cash",
    paymentStatus:
      initialSale?.paymentStatus ||
      "Pending",
    notes: initialSale?.notes || "",
  };
}

function hydrateServiceSale(initialSale) {
  return {
    ...createServiceSale(),
    id: initialSale?.id || "",
    type: "service",
    customerId: initialSale?.customerId || "",
    customerName:
      initialSale?.customerName ||
      initialSale?.customer ||
      "",
    isCustomCustomer:
      initialSale?.isCustomCustomer || false,
    serviceId:
      initialSale?.serviceId || "",
    serviceName:
      initialSale?.serviceName ||
      initialSale?.item ||
      "",
    isCustomService:
      initialSale?.isCustomService || false,
    equipment: Array.isArray(initialSale?.equipment)
      ? initialSale.equipment
      : [],
    serviceCharge:
      initialSale?.serviceCharge ??
      initialSale?.unitPrice ??
      0,
    discount: initialSale?.discount ?? 0,
    tax: initialSale?.tax ?? 0,
    technicianId:
      initialSale?.technicianId || "",
    technicianName:
      initialSale?.technicianName ||
      initialSale?.technician ||
      "",
    salespersonId:
      initialSale?.salespersonId || "",
    salespersonName:
      initialSale?.salespersonName ||
      initialSale?.salesperson ||
      "",
    paymentMethod:
      initialSale?.paymentMethod ||
      "Cash",
    paymentStatus:
      initialSale?.paymentStatus ||
      "Pending",
    notes: initialSale?.notes || "",
  };
}

export default function SaleEntryForm({
  open,
  onClose,
  onSave,
  onPrint,
  initialSale = null,
}) {
  const [activeType, setActiveType] = useState("product");

  const [productSale, setProductSale] = useState(
    createProductSale(),
  );

  const [serviceSale, setServiceSale] = useState(
    createServiceSale(),
  );

  const currentSale =
    activeType === "product"
      ? productSale
      : serviceSale;

  /*
   * Hydrate the correct form whenever:
   * - the form opens
   * - a different sale is selected for editing
   *
   * This is intentionally kept as ONE effect.
   */
  useEffect(() => {
    if (!open) {
      return;
    }

    if (!initialSale) {
      setActiveType("product");
      setProductSale(createProductSale());
      setServiceSale(createServiceSale());
      return;
    }

    const saleType = getSaleType(initialSale);

    setActiveType(saleType);

    if (saleType === "product") {
      setProductSale(
        hydrateProductSale(initialSale),
      );

      setServiceSale(createServiceSale());
      return;
    }

    setServiceSale(
      hydrateServiceSale(initialSale),
    );

    setProductSale(createProductSale());
  }, [open, initialSale]);

  const total = useMemo(() => {
    if (activeType === "product") {
      const subtotal =
        Number(productSale.quantity || 0) *
        Number(productSale.unitPrice || 0);

      return Math.max(
        subtotal -
          Number(productSale.discount || 0) +
          Number(productSale.tax || 0),
        0,
      );
    }

    const equipmentTotal =
      serviceSale.equipment.reduce(
        (sum, item) =>
          sum +
          Number(item.quantity || 0) *
            Number(item.price || 0),
        0,
      );

    return Math.max(
      equipmentTotal +
        Number(serviceSale.serviceCharge || 0) -
        Number(serviceSale.discount || 0) +
        Number(serviceSale.tax || 0),
      0,
    );
  }, [
    activeType,
    productSale,
    serviceSale,
  ]);

  function handleProductChange(field, value) {
    setProductSale((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleServiceChange(field, value) {
    setServiceSale((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleTypeChange(type) {
    setActiveType(type);
  }

  function handleSave(saveAndPrint = false) {
    const payload = {
      ...currentSale,
      type: activeType,
      total,
      savedAt: new Date().toISOString(),
    };

    /*
     * Keep the existing sale ID during edit.
     * New sales can be assigned an ID by the parent.
     */
    console.log(
      initialSale
        ? "Updating sale:"
        : "Creating sale:",
      payload,
    );

    if (onSave) {
      onSave(payload);
    }

    /*
     * Save & Print opens the same receipt flow used by
     * the row-level Print Receipt action.
     *
     * Do NOT call window.print() here because that would
     * print the entire Daily page instead of the receipt.
     */
    if (saveAndPrint && onPrint) {
      onPrint(payload);
      return;
    }

    onClose();
  }

  if (!open) {
    return null;
  }

  return (
    <div className="border-t border-slate-200 bg-slate-50">
      <div className="w-full px-3 py-4 sm:px-5 lg:px-6">
        <div className="overflow-visible rounded-xl border border-slate-200 bg-white shadow-sm">
          {/* HEADER */}
          <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-4 py-4 sm:px-5">
            <div className="min-w-0">
              <h3 className="text-base font-semibold text-slate-900">
                {initialSale
                  ? "Edit Sale Entry"
                  : "New Sale Entry"}
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                {initialSale
                  ? "Update the existing product or service transaction."
                  : "Record a product sale or service transaction."}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="Close sale form"
            >
              <X size={17} />
            </button>
          </div>

          {/* TYPE TABS */}
          <div className="border-b border-slate-200 px-4 pt-3 sm:px-5">
            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1">
              <button
                type="button"
                onClick={() =>
                  handleTypeChange("product")
                }
                className={[
                  "inline-flex h-9 items-center gap-2 rounded-md px-4 text-xs font-semibold transition",
                  activeType === "product"
                    ? "bg-white text-sky-700 shadow-sm"
                    : "text-slate-500 hover:text-slate-700",
                ].join(" ")}
              >
                <Package size={15} />
                Product Sale
              </button>

              <button
                type="button"
                onClick={() =>
                  handleTypeChange("service")
                }
                className={[
                  "inline-flex h-9 items-center gap-2 rounded-md px-4 text-xs font-semibold transition",
                  activeType === "service"
                    ? "bg-white text-sky-700 shadow-sm"
                    : "text-slate-500 hover:text-slate-700",
                ].join(" ")}
              >
                <Wrench size={15} />
                Service Sale
              </button>
            </div>
          </div>

          {/* FORM CONTENT */}
          <div className="p-4 sm:p-5">
            {activeType === "product" ? (
              <ProductSaleForm
                value={productSale}
                onChange={handleProductChange}
                customers={CUSTOMERS}
                items={ITEMS.filter(
                  (item) =>
                    item.type === "product",
                )}
                salespersons={SALESPERSONS}
                total={total}
              />
            ) : (
              <ServiceSaleForm
                value={serviceSale}
                onChange={handleServiceChange}
                customers={CUSTOMERS}
                services={ITEMS.filter(
                  (item) =>
                    item.type === "service",
                )}
                equipment={EQUIPMENT}
                technicians={TECHNICIANS}
                salespersons={SALESPERSONS}
                total={total}
              />
            )}
          </div>

          {/* FOOTER */}
          <div className="flex flex-col-reverse gap-2 border-t border-slate-200 bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div className="text-xs text-slate-400">
              {activeType === "product"
                ? "Product sale"
                : "Service sale"}{" "}
              ·{" "}
              {initialSale
                ? "Ready to update"
                : "Ready to save"}
            </div>

            <div className="flex flex-col-reverse gap-2 sm:flex-row">
              <button
                type="button"
                onClick={onClose}
                className="h-9 rounded-lg border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => handleSave(false)}
                className="h-9 rounded-lg border border-sky-200 bg-white px-4 text-xs font-semibold text-sky-700 transition hover:bg-sky-50"
              >
                {initialSale
                  ? "Update Sale"
                  : "Save Sale"}
              </button>

              <button
                type="button"
                onClick={() => handleSave(true)}
                className="h-9 rounded-lg bg-sky-600 px-4 text-xs font-semibold text-white shadow-sm transition hover:bg-sky-700"
              >
                {initialSale
                  ? "Update & Print"
                  : "Save & Print"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
