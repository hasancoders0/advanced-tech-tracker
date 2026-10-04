"use client";

import { useMemo, useState } from "react";
import {
  Check,
  ChevronDown,
  Package,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

/* =========================================================
   FIELD LABEL
   ========================================================= */

function FieldLabel({ children, required = false }) {
  return (
    <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wide text-slate-500">
      {children}
      {required && <span className="ml-1 text-red-500">*</span>}
    </label>
  );
}

/* =========================================================
   SEARCH FIELD
   ========================================================= */

function SearchField({
  value,
  placeholder,
  items = [],
  onChange,
  onSelect,
  displayKey = "name",
  emptyMessage,
  newMessage,
  autoFocus = false,
}) {
  const [focused, setFocused] = useState(false);

  const query = String(value || "").trim().toLowerCase();

  const filteredItems = useMemo(() => {
    if (!query) {
      return items.slice(0, 8);
    }

    return items
      .filter((item) =>
        String(item[displayKey] || "")
          .toLowerCase()
          .includes(query)
      )
      .slice(0, 8);
  }, [items, query, displayKey]);

  const exactMatch = items.some(
    (item) =>
      String(item[displayKey] || "")
        .trim()
        .toLowerCase() === query && query
  );

  const showDropdown =
    focused && (filteredItems.length > 0 || (query && !exactMatch));

  return (
    <div className="relative">
      <div
        className={[
          "flex h-9 items-center rounded-lg border bg-white transition",
          focused
            ? "border-sky-400 ring-2 ring-sky-100"
            : "border-slate-200 hover:border-slate-300",
        ].join(" ")}
      >
        <Search
          size={14}
          className="ml-3 shrink-0 text-slate-400"
        />

        <input
          type="text"
          value={value || ""}
          placeholder={placeholder}
          autoFocus={autoFocus}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            window.setTimeout(() => {
              setFocused(false);
            }, 150);
          }}
          onChange={(event) => onChange(event.target.value)}
          className="h-full min-w-0 flex-1 bg-transparent px-2 text-xs text-slate-700 outline-none placeholder:text-slate-400"
        />

        {exactMatch && (
          <Check
            size={14}
            className="mr-3 shrink-0 text-emerald-500"
          />
        )}
      </div>

      {showDropdown && (
        <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl">
          {filteredItems.length > 0 && (
            <div className="max-h-52 overflow-y-auto py-1">
              {filteredItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onMouseDown={(event) => {
                    event.preventDefault();
                    onSelect(item);
                    setFocused(false);
                  }}
                  className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left transition hover:bg-slate-50"
                >
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-slate-700">
                      {item[displayKey]}
                    </p>

                    {(item.phone || item.category) && (
                      <p className="mt-0.5 truncate text-[10px] text-slate-400">
                        {item.phone || item.category}
                      </p>
                    )}
                  </div>

                  {item.price !== undefined && (
                    <span className="shrink-0 text-xs font-semibold text-slate-600">
                      ${Number(item.price || 0).toFixed(2)}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          {query && !exactMatch && (
            <div className="border-t border-slate-100 px-3 py-2.5">
              <p className="text-[10px] text-slate-400">
                {filteredItems.length === 0
                  ? emptyMessage || "No existing record found."
                  : "No exact record selected."}
              </p>

              {newMessage && (
                <p className="mt-1 text-[10px] font-medium text-sky-600">
                  {newMessage}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   MONEY INPUT
   ========================================================= */

function MoneyInput({
  value,
  onChange,
  placeholder = "0",
}) {
  return (
    <div className="flex h-9 items-center rounded-lg border border-slate-200 bg-white transition hover:border-slate-300 focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-100">
      <span className="pl-3 text-xs text-slate-400">
        $
      </span>

      <input
        type="number"
        min="0"
        step="0.01"
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(
            event.target.value === ""
              ? 0
              : Number(event.target.value)
          )
        }
        className="h-full min-w-0 flex-1 bg-transparent px-2 text-xs text-slate-700 outline-none"
      />
    </div>
  );
}

/* =========================================================
   SELECT FIELD
   ========================================================= */

function SelectField({
  value,
  onChange,
  options,
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-9 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-8 text-xs text-slate-700 outline-none transition hover:border-slate-300 focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>

      <ChevronDown
        size={14}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
      />
    </div>
  );
}

/* =========================================================
   MAIN COMPONENT
   ========================================================= */

export default function ServiceSaleForm({
  value,
  onChange,
  customers = [],
  services = [],
  equipment = [],
  technicians = [],
  salespersons = [],
  total = 0,
}) {
  const equipmentTotal = useMemo(() => {
    return (value.equipment || []).reduce(
      (sum, item) =>
        sum +
        Number(item.quantity || 0) *
          Number(item.price || 0),
      0
    );
  }, [value.equipment]);

  /* =======================================================
     CUSTOMER
     ======================================================= */

  function handleCustomerChange(customerName) {
    onChange("customerName", customerName);
    onChange("customerId", "");
    onChange("isCustomCustomer", true);
  }

  function handleCustomerSelect(customer) {
    onChange("customerId", customer.id);
    onChange("customerName", customer.name);
    onChange("isCustomCustomer", false);
  }

  /* =======================================================
     SERVICE
     ======================================================= */

  function handleServiceChange(serviceName) {
    onChange("serviceName", serviceName);
    onChange("serviceId", "");
    onChange("isCustomService", true);
  }

  function handleServiceSelect(service) {
    onChange("serviceId", service.id);
    onChange("serviceName", service.name);
    onChange("isCustomService", false);

    if (service.price !== undefined) {
      onChange(
        "serviceCharge",
        Number(service.price)
      );
    }
  }

  /* =======================================================
     EQUIPMENT
     ======================================================= */

  function addEquipment() {
    const newEquipment = {
      id: `equipment-line-${Date.now()}`,
      equipmentId: "",
      name: "",
      quantity: 1,
      price: 0,
    };

    onChange("equipment", [
      ...(value.equipment || []),
      newEquipment,
    ]);
  }

  function updateEquipment(
    equipmentLineId,
    field,
    fieldValue
  ) {
    const updated = (value.equipment || []).map(
      (item) =>
        item.id === equipmentLineId
          ? {
              ...item,
              [field]: fieldValue,
            }
          : item
    );

    onChange("equipment", updated);
  }

  function selectEquipment(
    equipmentLineId,
    selectedEquipment
  ) {
    const updated = (value.equipment || []).map(
      (item) =>
        item.id === equipmentLineId
          ? {
              ...item,
              equipmentId: selectedEquipment.id,
              name: selectedEquipment.name,
              price: Number(
                selectedEquipment.price || 0
              ),
            }
          : item
    );

    onChange("equipment", updated);
  }

  function removeEquipment(equipmentLineId) {
    const updated = (
      value.equipment || []
    ).filter(
      (item) => item.id !== equipmentLineId
    );

    onChange("equipment", updated);
  }

  /* =======================================================
     TECHNICIAN
     ======================================================= */

  function handleTechnicianChange(name) {
    onChange("technicianId", "");
    onChange("technicianName", name);
  }

  function handleTechnicianSelect(technician) {
    onChange(
      "technicianId",
      technician.id
    );

    onChange(
      "technicianName",
      technician.name
    );
  }

  /* =======================================================
     SALESPERSON
     ======================================================= */

  function handleSalespersonChange(name) {
    onChange("salespersonId", "");
    onChange("salespersonName", name);
  }

  function handleSalespersonSelect(person) {
    onChange(
      "salespersonId",
      person.id
    );

    onChange(
      "salespersonName",
      person.name
    );
  }

  const technicianValue =
    value.technicianName ||
    technicians.find(
      (item) =>
        item.id === value.technicianId
    )?.name ||
    "";

  const salespersonValue =
    value.salespersonName ||
    salespersons.find(
      (item) =>
        item.id === value.salespersonId
    )?.name ||
    "";

  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_288px]">
      {/* =================================================
          LEFT SIDE
         ================================================= */}

      <div className="min-w-0 space-y-4">
        {/* CUSTOMER + SERVICE */}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <FieldLabel required>
              Customer
            </FieldLabel>

            <SearchField
              value={value.customerName}
              placeholder="Search customer or enter name..."
              items={customers}
              displayKey="name"
              onChange={handleCustomerChange}
              onSelect={handleCustomerSelect}
              emptyMessage="No existing customer found."
              newMessage="New customer — will be saved with the sale."
            />

            {value.customerName &&
              value.isCustomCustomer && (
                <p className="mt-1.5 text-[10px] text-slate-400">
                  New customer — will be saved
                  with the sale.
                </p>
              )}
          </div>

          <div>
            <FieldLabel required>
              Service
            </FieldLabel>

            <SearchField
              value={value.serviceName}
              placeholder="Search service or enter service name..."
              items={services}
              displayKey="name"
              onChange={handleServiceChange}
              onSelect={handleServiceSelect}
              emptyMessage="No existing service found."
              newMessage="New service — enter the service charge below."
            />

            {value.serviceName &&
              value.isCustomService && (
                <p className="mt-1.5 text-[10px] text-slate-400">
                  New service — enter the
                  service charge below.
                </p>
              )}
          </div>
        </div>

        {/* =================================================
            EQUIPMENT / PARTS
           ================================================= */}

        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
          {/* SECTION HEADER */}

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Package
                  size={15}
                  className="text-sky-600"
                />

                <h3 className="text-xs font-semibold text-slate-800">
                  Equipment / Parts Used
                </h3>
              </div>

              <p className="mt-0.5 text-[10px] text-slate-400">
                Add equipment or parts used
                during this service.
              </p>
            </div>

            <button
              type="button"
              onClick={addEquipment}
              className="inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-sky-200 bg-white px-3 text-[11px] font-semibold text-sky-700 transition hover:bg-sky-50"
            >
              <Plus size={14} />
              Add Equipment
            </button>
          </div>

          {/* =================================================
              SINGLE TABLE HEADER
             ================================================= */}

          {(value.equipment || []).length >
            0 && (
            <div className="mt-3 hidden grid-cols-[minmax(0,1fr)_72px_100px_92px_32px] items-center gap-2 px-1 lg:grid">
              <span className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                Equipment / Part
              </span>

              <span className="text-right text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                Qty
              </span>

              <span className="text-right text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                Unit Price
              </span>

              <span className="text-right text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                Total
              </span>

              <span />
            </div>
          )}

          {/* =================================================
              EQUIPMENT ROWS

              IMPORTANT:
              No FieldLabel is rendered inside these rows.
              The table header above is the only header.
             ================================================= */}

          <div className="mt-2 space-y-2">
            {(value.equipment || []).map(
              (item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-1 gap-2 rounded-lg border border-slate-200 bg-white p-2 lg:grid-cols-[minmax(0,1fr)_72px_100px_92px_32px] lg:items-center lg:border-0 lg:bg-transparent lg:p-0"
                >
                  {/* EQUIPMENT */}

                  <div className="min-w-0">
                    <SearchField
                      value={item.name}
                      placeholder="Search equipment or enter name..."
                      items={equipment}
                      displayKey="name"
                      onChange={(name) =>
                        updateEquipment(
                          item.id,
                          "name",
                          name
                        )
                      }
                      onSelect={(selected) =>
                        selectEquipment(
                          item.id,
                          selected
                        )
                      }
                      emptyMessage="No existing equipment found."
                      newMessage="Custom equipment — enter the unit price."
                    />
                  </div>

                  {/* QTY */}

                  <input
                    type="number"
                    min="1"
                    aria-label="Quantity"
                    value={
                      item.quantity ?? 1
                    }
                    onChange={(event) =>
                      updateEquipment(
                        item.id,
                        "quantity",
                        Math.max(
                          1,
                          Number(
                            event.target.value ||
                              1
                          )
                        )
                      )
                    }
                    className="h-9 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-xs text-slate-700 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                  />

                  {/* UNIT PRICE */}

                  <MoneyInput
                    value={item.price}
                    onChange={(price) =>
                      updateEquipment(
                        item.id,
                        "price",
                        price
                      )
                    }
                  />

                  {/* TOTAL */}

                  <div
                    aria-label="Equipment total"
                    className="flex h-9 items-center justify-end rounded-lg bg-slate-50 px-2.5 text-xs font-semibold text-slate-700"
                  >
                    $
                    {(
                      Number(
                        item.quantity || 0
                      ) *
                      Number(
                        item.price || 0
                      )
                    ).toFixed(2)}
                  </div>

                  {/* DELETE */}

                  <button
                    type="button"
                    onClick={() =>
                      removeEquipment(
                        item.id
                      )
                    }
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                    aria-label="Remove equipment"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              )
            )}

            {/* EMPTY STATE */}

            {(value.equipment || []).length ===
              0 && (
              <button
                type="button"
                onClick={addEquipment}
                className="flex min-h-[62px] w-full items-center justify-center rounded-lg border border-dashed border-slate-200 bg-white text-[11px] text-slate-400 transition hover:border-sky-300 hover:bg-sky-50/30 hover:text-sky-600"
              >
                <span>
                  No equipment or parts added.
                  <span className="ml-1 font-semibold text-sky-600">
                    + Add equipment
                  </span>
                </span>
              </button>
            )}
          </div>

          {/* EQUIPMENT TOTAL */}

          <div className="mt-3 flex items-center justify-end border-t border-slate-200 pt-3">
            <div className="text-right">
              <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                Equipment Total
              </p>

              <p className="mt-0.5 text-sm font-semibold text-slate-800">
                $
                {equipmentTotal.toFixed(
                  2
                )}
              </p>
            </div>
          </div>
        </div>

        {/* =================================================
            CHARGES
           ================================================= */}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <FieldLabel>
              Service Charge
            </FieldLabel>

            <MoneyInput
              value={value.serviceCharge}
              onChange={(amount) =>
                onChange(
                  "serviceCharge",
                  amount
                )
              }
            />
          </div>

          <div>
            <FieldLabel>
              Discount
            </FieldLabel>

            <MoneyInput
              value={value.discount}
              onChange={(amount) =>
                onChange(
                  "discount",
                  amount
                )
              }
            />
          </div>

          <div>
            <FieldLabel>
              Tax
            </FieldLabel>

            <MoneyInput
              value={value.tax}
              onChange={(amount) =>
                onChange(
                  "tax",
                  amount
                )
              }
            />
          </div>

          <div>
            <FieldLabel>
              Total
            </FieldLabel>

            <div className="flex h-9 items-center rounded-lg border border-sky-100 bg-sky-50 px-3 text-sm font-semibold text-slate-900">
              $
              {Number(total || 0).toFixed(
                2
              )}
            </div>
          </div>
        </div>

        {/* =================================================
            STAFF + PAYMENT
           ================================================= */}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <FieldLabel>
              Worked By
            </FieldLabel>

            <SearchField
              value={technicianValue}
              placeholder="Search technician..."
              items={technicians}
              displayKey="name"
              onChange={handleTechnicianChange}
              onSelect={handleTechnicianSelect}
              emptyMessage="No technician found."
              newMessage="Custom technician name."
            />
          </div>

          <div>
            <FieldLabel>
              Salesperson
            </FieldLabel>

            <SearchField
              value={salespersonValue}
              placeholder="Search salesperson..."
              items={salespersons}
              displayKey="name"
              onChange={handleSalespersonChange}
              onSelect={handleSalespersonSelect}
              emptyMessage="No salesperson found."
              newMessage="Custom salesperson name."
            />
          </div>

          <div>
            <FieldLabel>
              Payment Method
            </FieldLabel>

            <SelectField
              value={
                value.paymentMethod ||
                "Cash"
              }
              onChange={(method) =>
                onChange(
                  "paymentMethod",
                  method
                )
              }
              options={[
                {
                  value: "Cash",
                  label: "Cash",
                },
                {
                  value: "Card",
                  label: "Card",
                },
                {
                  value: "Check",
                  label: "Check",
                },
                {
                  value: "Bank Transfer",
                  label: "Bank Transfer",
                },
                {
                  value: "Other",
                  label: "Other",
                },
              ]}
            />
          </div>

          <div>
            <FieldLabel>
              Payment Status
            </FieldLabel>

            <SelectField
              value={
                value.paymentStatus ||
                "Pending"
              }
              onChange={(status) =>
                onChange(
                  "paymentStatus",
                  status
                )
              }
              options={[
                {
                  value: "Pending",
                  label: "Pending",
                },
                {
                  value: "Paid",
                  label: "Paid",
                },
                {
                  value: "Partial",
                  label: "Partial",
                },
                {
                  value: "Overdue",
                  label: "Overdue",
                },
              ]}
            />
          </div>
        </div>
      </div>

      {/* =================================================
          NOTES
         ================================================= */}

      <div className="min-w-0">
        <FieldLabel>
          Notes
        </FieldLabel>

        <textarea
          value={value.notes || ""}
          onChange={(event) =>
            onChange(
              "notes",
              event.target.value
            )
          }
          placeholder="Add notes about this service..."
          className="min-h-[180px] w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs leading-5 text-slate-700 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 lg:min-h-[270px]"
        />
      </div>
    </div>
  );
}