"use client";

import { useMemo, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";

const PAYMENT_METHODS = ["Cash", "Card", "Check", "Bank Transfer", "Other"];

const PAYMENT_STATUSES = ["Pending", "Paid", "Partial", "Cancelled"];

function FieldLabel({ children, required = false }) {
  return (
    <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wide text-slate-500">
      {children}

      {required && <span className="ml-1 text-red-500">*</span>}
    </label>
  );
}

function InputField({
  value,
  onChange,
  placeholder = "",
  type = "text",
  prefix,
  suffix,
}) {
  return (
    <div className="flex h-9 w-full items-center overflow-hidden rounded-lg border border-slate-200 bg-white transition focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-100">
      {prefix && <span className="pl-3 text-xs text-slate-400">{prefix}</span>}

      <input
        type={type}
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        min={type === "number" ? "0" : undefined}
        step={type === "number" ? "0.01" : undefined}
        className="h-full min-w-0 flex-1 bg-transparent px-3 text-xs text-slate-700 outline-none placeholder:text-slate-400"
      />

      {suffix && (
        <span className="pr-3 text-[10px] font-medium text-slate-400">
          {suffix}
        </span>
      )}
    </div>
  );
}

function SelectField({ value, onChange, options, placeholder = "Select..." }) {
  return (
    <div className="relative">
      <select
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
        className="h-9 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-9 text-xs text-slate-700 outline-none transition hover:border-slate-300 focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
      >
        <option value="">{placeholder}</option>

        {options.map((option) => {
          const optionValue = typeof option === "string" ? option : option.id;

          const optionLabel = typeof option === "string" ? option : option.name;

          return (
            <option key={optionValue} value={optionValue}>
              {optionLabel}
            </option>
          );
        })}
      </select>

      <ChevronDown
        size={14}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
      />
    </div>
  );
}

/* -------------------------------------------------------
   SEARCH FIELD
------------------------------------------------------- */

function SearchField({
  value,
  placeholder,
  results,
  onChange,
  onSelect,
  emptyMessage,
  onFocus,
  onBlur,
  showDropdown,
}) {
  const hasValue = String(value || "").trim().length > 0;

  const shouldShow = showDropdown && (results.length > 0 || hasValue);

  return (
    <div className="relative">
      <div className="flex h-9 w-full items-center rounded-lg border border-slate-200 bg-white transition focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-100">
        <Search size={14} className="ml-3 shrink-0 text-slate-400" />

        <input
          value={value || ""}
          onChange={(event) => onChange(event.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={placeholder}
          className="h-full min-w-0 flex-1 bg-transparent px-2 text-xs text-slate-700 outline-none placeholder:text-slate-400"
        />

        {hasValue && results.length === 0 && (
          <Check size={14} className="mr-3 shrink-0 text-emerald-500" />
        )}
      </div>

      {shouldShow && (
        <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 max-h-60 overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-xl">
          {results.length > 0 ? (
            results.slice(0, 8).map((item) => (
              <button
                key={item.id}
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => onSelect(item)}
                className="flex w-full items-center justify-between border-b border-slate-100 px-3 py-2.5 text-left last:border-b-0 hover:bg-slate-50"
              >
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-slate-700">
                    {item.name}
                  </p>

                  {item.phone && (
                    <p className="mt-0.5 text-[10px] text-slate-400">
                      {item.phone}
                    </p>
                  )}

                  {item.email && (
                    <p className="mt-0.5 truncate text-[10px] text-slate-400">
                      {item.email}
                    </p>
                  )}

                  {item.category && (
                    <p className="mt-0.5 text-[10px] text-slate-400">
                      {item.category}
                    </p>
                  )}
                </div>

                <Check size={14} className="shrink-0 text-slate-300" />
              </button>
            ))
          ) : (
            <div className="px-3 py-2.5">
              <p className="text-[10px] text-slate-400">{emptyMessage}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------
   PRODUCT SALE FORM
------------------------------------------------------- */

export default function ProductSaleForm({
  value,
  onChange,
  customers = [],
  items = [],
  salespersons = [],
  total = 0,
}) {
  const [customerFocused, setCustomerFocused] = useState(false);

  const [productFocused, setProductFocused] = useState(false);

  const [salespersonFocused, setSalespersonFocused] = useState(false);

  /* -----------------------------------------------------
     CUSTOMER FILTER
  ----------------------------------------------------- */

  const customerResults = useMemo(() => {
    const query = String(value.customerName || "")
      .trim()
      .toLowerCase();

    if (!query) {
      return customers;
    }

    return customers.filter((customer) =>
      [customer.name, customer.phone, customer.email]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(query)),
    );
  }, [customers, value.customerName]);

  /* -----------------------------------------------------
     PRODUCT FILTER
  ----------------------------------------------------- */

  const productResults = useMemo(() => {
    const query = String(value.itemName || "")
      .trim()
      .toLowerCase();

    if (!query) {
      return items;
    }

    return items.filter((item) =>
      [item.name, item.category]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(query)),
    );
  }, [items, value.itemName]);

  /* -----------------------------------------------------
     SALESPERSON FILTER
  ----------------------------------------------------- */

  const salespersonResults = useMemo(() => {
    const query = String(value.salespersonName || "")
      .trim()
      .toLowerCase();

    if (!query) {
      return salespersons;
    }

    return salespersons.filter((person) =>
      [person.name, person.email]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(query)),
    );
  }, [salespersons, value.salespersonName]);

  /* -----------------------------------------------------
     CUSTOMER
  ----------------------------------------------------- */

  function handleCustomerChange(name) {
    const exactMatch = customers.find(
      (customer) =>
        String(customer.name).toLowerCase() === name.trim().toLowerCase(),
    );

    if (exactMatch) {
      onChange("customerId", exactMatch.id);

      onChange("customerName", exactMatch.name);

      onChange("isCustomCustomer", false);

      return;
    }

    onChange("customerId", "");

    onChange("customerName", name);

    onChange("isCustomCustomer", name.trim().length > 0);
  }

  function handleCustomerSelect(customer) {
    onChange("customerId", customer.id);

    onChange("customerName", customer.name);

    onChange("isCustomCustomer", false);

    setCustomerFocused(false);
  }

  /* -----------------------------------------------------
     PRODUCT
  ----------------------------------------------------- */

  function handleProductChange(name) {
    const exactMatch = items.find(
      (item) => String(item.name).toLowerCase() === name.trim().toLowerCase(),
    );

    if (exactMatch) {
      onChange("itemId", exactMatch.id);

      onChange("itemName", exactMatch.name);

      onChange("unitPrice", Number(exactMatch.price || 0));

      onChange("isCustomProduct", false);

      return;
    }

    onChange("itemId", "");

    onChange("itemName", name);

    onChange("isCustomProduct", name.trim().length > 0);
  }

  function handleProductSelect(product) {
    onChange("itemId", product.id);

    onChange("itemName", product.name);

    onChange("unitPrice", Number(product.price || 0));

    onChange("isCustomProduct", false);

    setProductFocused(false);
  }

  /* -----------------------------------------------------
     SALESPERSON
  ----------------------------------------------------- */

  function handleSalespersonChange(name) {
    const exactMatch = salespersons.find(
      (person) =>
        String(person.name).toLowerCase() === name.trim().toLowerCase(),
    );

    if (exactMatch) {
      onChange("salespersonId", exactMatch.id);

      onChange("salespersonName", exactMatch.name);

      onChange("isCustomSalesperson", false);

      return;
    }

    onChange("salespersonId", "");

    onChange("salespersonName", name);

    onChange("isCustomSalesperson", name.trim().length > 0);
  }

  function handleSalespersonSelect(salesperson) {
    onChange("salespersonId", salesperson.id);

    onChange("salespersonName", salesperson.name);

    onChange("isCustomSalesperson", false);

    setSalespersonFocused(false);
  }

  /* -----------------------------------------------------
     RENDER
  ----------------------------------------------------- */

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
      {/* =================================================
          LEFT
      ================================================= */}

      <div className="min-w-0 space-y-4">
        {/* CUSTOMER + PRODUCT */}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* CUSTOMER */}

          <div>
            <FieldLabel required>Customer</FieldLabel>

            <SearchField
              value={value.customerName}
              placeholder="Search customer or enter name..."
              results={customerResults}
              onChange={handleCustomerChange}
              onSelect={handleCustomerSelect}
              onFocus={() => setCustomerFocused(true)}
              onBlur={() => setTimeout(() => setCustomerFocused(false), 150)}
              showDropdown={customerFocused}
              emptyMessage="New customer — will be saved with this sale."
            />
          </div>

          {/* PRODUCT */}

          <div>
            <FieldLabel required>Product</FieldLabel>

            <SearchField
              value={value.itemName}
              placeholder="Search product or enter product name..."
              results={productResults}
              onChange={handleProductChange}
              onSelect={handleProductSelect}
              onFocus={() => setProductFocused(true)}
              onBlur={() => setTimeout(() => setProductFocused(false), 150)}
              showDropdown={productFocused}
              emptyMessage="New product — enter the unit price below."
            />
          </div>
        </div>

        {/* QUANTITY / PRICE / DISCOUNT / TAX */}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div>
            <FieldLabel>Quantity</FieldLabel>

            <InputField
              type="number"
              value={value.quantity}
              onChange={(quantity) => onChange("quantity", quantity)}
              placeholder="1"
            />
          </div>

          <div>
            <FieldLabel>Unit Price</FieldLabel>

            <InputField
              type="number"
              value={value.unitPrice}
              onChange={(unitPrice) => onChange("unitPrice", unitPrice)}
              placeholder="0.00"
              prefix="$"
            />
          </div>

          <div>
            <FieldLabel>Discount</FieldLabel>

            <InputField
              type="number"
              value={value.discount}
              onChange={(discount) => onChange("discount", discount)}
              placeholder="0.00"
              prefix="$"
            />
          </div>

          <div>
            <FieldLabel>Tax</FieldLabel>

            <InputField
              type="number"
              value={value.tax}
              onChange={(tax) => onChange("tax", tax)}
              placeholder="0.00"
              prefix="$"
            />
          </div>
        </div>

        {/* SALESPERSON / PAYMENT / STATUS / TOTAL */}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {/* SALESPERSON */}

          <div>
            <FieldLabel>Salesperson</FieldLabel>

            <SearchField
              value={value.salespersonName || ""}
              placeholder="Search salesperson..."
              results={salespersonResults}
              onChange={handleSalespersonChange}
              onSelect={handleSalespersonSelect}
              onFocus={() => setSalespersonFocused(true)}
              onBlur={() => setTimeout(() => setSalespersonFocused(false), 150)}
              showDropdown={salespersonFocused}
              emptyMessage="New salesperson — will be saved with this sale."
            />
          </div>

          {/* PAYMENT METHOD */}

          <div>
            <FieldLabel>Payment Method</FieldLabel>

            <SelectField
              value={value.paymentMethod}
              onChange={(paymentMethod) =>
                onChange("paymentMethod", paymentMethod)
              }
              options={PAYMENT_METHODS}
              placeholder="Select payment method"
            />
          </div>

          {/* PAYMENT STATUS */}

          <div>
            <FieldLabel>Payment Status</FieldLabel>

            <SelectField
              value={value.paymentStatus}
              onChange={(paymentStatus) =>
                onChange("paymentStatus", paymentStatus)
              }
              options={PAYMENT_STATUSES}
              placeholder="Select payment status"
            />
          </div>

          {/* TOTAL */}

          <div>
            <FieldLabel>Total</FieldLabel>

            <div className="flex h-9 items-center rounded-lg border border-sky-100 bg-sky-50 px-3">
              <span className="truncate text-sm font-semibold text-slate-900">
                ${Number(total || 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* =================================================
          NOTES
      ================================================= */}

      <div className="min-w-0">
        <FieldLabel>Notes</FieldLabel>

        <textarea
          value={value.notes || ""}
          onChange={(event) => onChange("notes", event.target.value)}
          placeholder="Add any useful information about the customer, product, payment, or transaction."
          className="min-h-[178px] w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs leading-5 text-slate-700 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
        />
      </div>
    </div>
  );
}
