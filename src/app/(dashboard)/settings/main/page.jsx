"use client";

import { useState } from "react";
import {
  Archive,
  DatabaseBackup,
  FileUp,
  History,
  Plus,
  Save,
  Settings,
} from "lucide-react";

import PageHeader from "@/components/common/PageHeader";
import Card, {
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";

const initialDepartments = [
  "Field Operations",
  "Sales",
  "Warehouse",
];

export default function MainSettingsPage() {
  const [departments, setDepartments] = useState(
    initialDepartments
  );
  const [department, setDepartment] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  function addDepartment() {
    const value = department.trim();

    if (!value) {
      return;
    }

    setDepartments((current) => [
      ...current,
      value,
    ]);

    setDepartment("");
    setModalOpen(false);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Main Settings"
        description="Manage core application configuration and data management."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Departments</CardTitle>
            <CardDescription>
              Manage departments used throughout the application.
            </CardDescription>
          </CardHeader>

          <div className="space-y-2">
            {departments.map((item) => (
              <div
                key={item}
                className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3"
              >
                <span className="text-sm text-slate-700">
                  {item}
                </span>

                <span className="text-xs text-slate-400">
                  Active
                </span>
              </div>
            ))}
          </div>

          <Button
            className="mt-4"
            onClick={() => setModalOpen(true)}
          >
            <Plus size={16} />
            Add Department
          </Button>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Application Preferences</CardTitle>
            <CardDescription>
              Configure basic application preferences.
            </CardDescription>
          </CardHeader>

          <div className="space-y-4">
            <Input
              label="Application Name"
              defaultValue="Advanced Tech Tracker"
            />

            <Input
              label="Default Currency"
              defaultValue="USD"
            />

            <Input
              label="Default Date Format"
              defaultValue="MM/DD/YYYY"
            />

            <Button>
              <Save size={16} />
              Save Preferences
            </Button>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
          <CardDescription>
            Prototype actions for application data management.
          </CardDescription>
        </CardHeader>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Button variant="outline">
            <FileUp size={16} />
            Import Data
          </Button>

          <Button variant="outline">
            <DatabaseBackup size={16} />
            Backup
          </Button>

          <Button variant="outline">
            <Archive size={16} />
            Restore
          </Button>

          <Button variant="outline">
            <History size={16} />
            Audit Log
          </Button>
        </div>
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Department"
        description="Create a new department."
      >
        <div className="space-y-4">
          <Input
            label="Department Name"
            value={department}
            onChange={(event) =>
              setDepartment(event.target.value)
            }
            placeholder="Enter department name"
          />

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>

            <Button onClick={addDepartment}>
              <Plus size={16} />
              Add Department
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
