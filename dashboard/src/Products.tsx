import { FormEvent, useEffect, useState } from 'react';
import { api, type Category, type Product } from '../api';

const empty = {
  name_ar: '',
  name_en: '',
  summary_ar: '',
  summary_en: '',
  category: 'equipment' as Category,
  slug: '',
  sort_order: 0,
  is_published: true,
};

export function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<Product | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState('');

  async function load() {
    const result = await api<{ data: Product[] }>('/api/admin/products');
    setProducts(result.data);
  }

  useEffect(() => {
    load().catch((caught) => setError(caught instanceof Error ? caught.message : 'تعذر التحميل'));
  }, []);

  function startEdit(product: Product) {
    setEditing(product);
    setImage(null);
    setForm({
      name_ar: product.name_ar,
      name_en: product.name_en,
      summary_ar: product.summary_ar ?? '',
      summary_en: product.summary_en ?? '',
      category: product.category,
      slug: product.slug,
      sort_order: product.sort_order,
      is_published: product.is_published,
    });
  }

  function reset() {
    setEditing(null);
    setImage(null);
    setForm(empty);
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError('');
    const body = new FormData();
    Object.entries(form).forEach(([key, value]) => body.append(key, String(value)));
    body.set('is_published', form.is_published ? '1' : '0');
    if (image) body.append('image', image);

    try {
      if (editing) {
        await api(`/api/admin/products/${editing.id}`, { method: 'POST', body });
      } else {
        await api('/api/admin/products', { method: 'POST', body });
      }
      reset();
      await load();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'تعذر الحفظ');
    }
  }

  async function remove(product: Product) {
    if (!confirm(`حذف ${product.name_ar}؟`)) return;
    await api(`/api/admin/products/${product.id}`, { method: 'DELETE' });
    if (editing?.id === product.id) reset();
    await load();
  }

  return (
    <div className="layout">
      <section className="panel">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>الصورة</th>
                <th>المنتج</th>
                <th>التصنيف</th>
                <th>النشر</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.image_url ? <img className="thumb" src={product.image_url} alt="" /> : '—'}</td>
                  <td>
                    <strong>{product.name_ar}</strong>
                    <div className="muted">{product.name_en}</div>
                  </td>
                  <td>{product.category === 'equipment' ? 'معدات' : 'سلامة'}</td>
                  <td>{product.is_published ? 'منشور' : 'مخفي'}</td>
                  <td className="actions">
                    <button className="ghost" type="button" onClick={() => startEdit(product)}>تعديل</button>
                    <button className="danger" type="button" onClick={() => remove(product)}>حذف</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <form className="panel form" onSubmit={submit}>
        <h2>{editing ? 'تعديل منتج' : 'منتج جديد'}</h2>
        <div className="row">
          <label>الاسم بالعربية<input value={form.name_ar} onChange={(event) => setForm({ ...form, name_ar: event.target.value })} required /></label>
          <label>الاسم بالإنجليزية<input value={form.name_en} onChange={(event) => setForm({ ...form, name_en: event.target.value })} required /></label>
        </div>
        <label>الوصف بالعربية<textarea value={form.summary_ar} onChange={(event) => setForm({ ...form, summary_ar: event.target.value })} /></label>
        <label>الوصف بالإنجليزية<textarea value={form.summary_en} onChange={(event) => setForm({ ...form, summary_en: event.target.value })} /></label>
        <div className="row">
          <label>
            التصنيف
            <select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value as Category })}>
              <option value="equipment">معدات الإطفاء</option>
              <option value="safety">الملابس والسلامة</option>
            </select>
          </label>
          <label>الترتيب<input type="number" min={0} value={form.sort_order} onChange={(event) => setForm({ ...form, sort_order: Number(event.target.value) })} /></label>
        </div>
        <label>المعرّف<input value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} placeholder="يُولد من الاسم الإنجليزي" /></label>
        <label>الصورة<input type="file" accept="image/*" onChange={(event) => setImage(event.target.files?.[0] ?? null)} /></label>
        <label className="check">
          <input type="checkbox" checked={form.is_published} onChange={(event) => setForm({ ...form, is_published: event.target.checked })} />
          ظاهر في الموقع
        </label>
        {error ? <p className="error">{error}</p> : null}
        <div className="actions">
          <button className="primary" type="submit">{editing ? 'حفظ التعديل' : 'إضافة'}</button>
          {editing ? <button className="ghost" type="button" onClick={reset}>إلغاء</button> : null}
        </div>
      </form>
    </div>
  );
}
