import { useMemo, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  FolderOpen,
  Package,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

import {
  getCategories,
  getCategoryProductCount,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../categories/services/categoryService";

const EMPTY_FORM = {
  name: "",
  description: "",
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState(() => getCategories());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [feedback, setFeedback] = useState("");

  const activeCount = useMemo(
    () => categories.filter((category) => category.isActive).length,
    [categories],
  );

  function refreshCategories() {
    setCategories(getCategories());
  }

  function openCreateForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFeedback("");
    setIsFormOpen(true);
  }

  function openEditForm(category) {
    setEditingId(category.id);
    setForm({
      name: category.name,
      description: category.description ?? "",
    });
    setFeedback("");
    setIsFormOpen(true);
  }

  function closeForm() {
    setIsFormOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setFeedback("");

    const result = editingId
      ? updateCategory(editingId, form)
      : createCategory(form);

    if (!result.success) {
      setFeedback(result.message);
      return;
    }

    refreshCategories();
    closeForm();

    setFeedback(
      editingId
        ? "Category updated successfully."
        : "Category created successfully.",
    );
  }

  function handleToggle(category) {
    const result = updateCategory(category.id, {
      isActive: !category.isActive,
    });

    if (!result.success) {
      setFeedback(result.message);
      return;
    }

    refreshCategories();
    setFeedback(
      category.isActive ? "Category deactivated." : "Category activated.",
    );
  }

  function handleDelete(category) {
    const productCount = getCategoryProductCount(category.id);

    const message =
      productCount > 0
        ? `This category contains ${productCount} product(s). Reassign those products before deleting it.`
        : `Delete the "${category.name}" category?`;

    if (productCount > 0) {
      setFeedback(message);
      return;
    }

    if (!window.confirm(message)) return;

    const result = deleteCategory(category.id);

    if (!result.success) {
      setFeedback(result.message);
      return;
    }

    refreshCategories();
    setFeedback("Category deleted successfully.");
  }

  return (
    <section className="mx-auto max-w-7xl space-y-8">
      <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs tracking-[0.3em] text-gold">
            CATALOGUE ORGANISATION
          </p>

          <h1 className="mt-3 font-display text-3xl text-champagne md:text-4xl">
            Categories<span className="text-gold">.</span>
          </h1>

          <p className="mt-3 text-sm text-white/45">
            Organise your products into easy-to-browse collections.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateForm}
          className="inline-flex items-center justify-center gap-2 bg-gold px-5 py-3 text-sm font-semibold text-obsidian transition-colors hover:bg-champagne"
        >
          <Plus size={17} />
          Add category
        </button>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="border border-white/10 bg-[#171319] p-5">
          <div className="flex items-center gap-3 text-white/45">
            <FolderOpen size={18} />
            <p className="text-xs">Total categories</p>
          </div>

          <p className="mt-3 font-display text-3xl text-champagne">
            {categories.length}
          </p>
        </div>

        <div className="border border-white/10 bg-[#171319] p-5">
          <div className="flex items-center gap-3 text-white/45">
            <Package size={18} />
            <p className="text-xs">Active categories</p>
          </div>

          <p className="mt-3 font-display text-3xl text-champagne">
            {activeCount}
          </p>
        </div>
      </div>

      {feedback && (
        <div
          role="status"
          className="flex items-center justify-between gap-4 border border-gold/20 bg-gold/5 px-5 py-3 text-sm text-gold"
        >
          {feedback}

          <button
            type="button"
            onClick={() => setFeedback("")}
            aria-label="Dismiss notification"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="border border-white/10 bg-[#171319]">
        <div className="border-b border-white/10 px-5 py-4">
          <h2 className="text-sm font-medium text-champagne">
            Your categories
          </h2>

          <p className="mt-1 text-xs text-white/40">
            Manage the collections customers can browse.
          </p>
        </div>

        {categories.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <FolderOpen size={30} className="mx-auto text-gold/60" />

            <p className="mt-4 text-sm text-champagne">No categories yet.</p>

            <p className="mt-2 text-xs text-white/40">
              Create your first category to organise your products.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {categories.map((category) => {
              const productCount = getCategoryProductCount(category.id);

              return (
                <article
                  key={category.id}
                  className="flex flex-col justify-between gap-5 px-5 py-5 sm:flex-row sm:items-center"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-medium text-champagne">
                        {category.name}
                      </h3>

                      <span
                        className={`border px-2.5 py-1 text-[10px] ${
                          category.isActive
                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                            : "border-white/10 bg-white/5 text-white/40"
                        }`}
                      >
                        {category.isActive ? "ACTIVE" : "INACTIVE"}
                      </span>

                      {category.isDemo && (
                        <span className="text-[10px] text-gold/60">DEMO</span>
                      )}
                    </div>

                    <p className="mt-2 text-xs text-white/40">
                      {category.description || "No description provided."}
                    </p>

                    <p className="mt-2 text-xs text-white/50">
                      {productCount}{" "}
                      {productCount === 1 ? "product" : "products"}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggle(category)}
                      title={
                        category.isActive
                          ? "Deactivate category"
                          : "Activate category"
                      }
                      aria-label={`${category.isActive ? "Deactivate" : "Activate"} ${category.name}`}
                      className="p-2 text-white/45 transition-colors hover:text-gold"
                    >
                      {category.isActive ? (
                        <ToggleRight size={20} />
                      ) : (
                        <ToggleLeft size={20} />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => openEditForm(category)}
                      title="Edit category"
                      aria-label={`Edit ${category.name}`}
                      className="p-2 text-white/45 transition-colors hover:text-gold"
                    >
                      <Pencil size={17} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(category)}
                      title="Delete category"
                      aria-label={`Delete ${category.name}`}
                      className="p-2 text-white/45 transition-colors hover:text-red-400"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/75 p-4 py-10">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="category-form-title"
            className="my-auto w-full max-w-xl border border-white/10 bg-[#171319] shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <div>
                <p className="text-[10px] tracking-[0.25em] text-gold">
                  CATALOGUE
                </p>

                <h2
                  id="category-form-title"
                  className="mt-2 font-display text-2xl text-champagne"
                >
                  {editingId ? "Edit category" : "Add category"}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeForm}
                aria-label="Close category form"
                className="text-white/45 hover:text-champagne"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-6">
              <div>
                <label className="mb-2 block text-xs text-white/55">
                  Category name *
                </label>

                <input
                  required
                  maxLength={80}
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  placeholder="e.g. Bone Straight"
                  className="h-12 w-full border border-white/10 bg-black/20 px-4 text-sm text-champagne outline-none focus:border-gold/50"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs text-white/55">
                  Description (optional)
                </label>

                <textarea
                  rows={3}
                  maxLength={300}
                  value={form.description}
                  onChange={(event) =>
                    updateField("description", event.target.value)
                  }
                  placeholder="A short description of this collection..."
                  className="w-full border border-white/10 bg-black/20 p-4 text-sm text-champagne outline-none focus:border-gold/50"
                />
              </div>

              <p className="text-xs leading-6 text-white/35">
                The category URL will be generated automatically from its name.
              </p>

              <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeForm}
                  className="border border-white/15 px-5 py-3 text-xs text-champagne/65 hover:border-white/30"
                >
                  CANCEL
                </button>

                <button
                  type="submit"
                  className="bg-gold px-6 py-3 text-xs font-semibold tracking-wider text-obsidian hover:bg-champagne"
                >
                  {editingId ? "SAVE CHANGES" : "CREATE CATEGORY"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
