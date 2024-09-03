import NavService from '@/services/navService';
import EditCategoryForm from './EditCategoryForm';
import EditItemForm from './EditItemForm';
import Divider from '@/components/Divider/Divider';
import AddItemForm from './AddItemForm';
import AddCategoryForm from './AddCategoryForm';
import React from 'react';

export default async function Page() {
  const stats = await NavService.get();

  return (
    <main>
      <title>Kontrollpanel - Navigering</title>
      <p>
        <i>Note:</i> A higher priority value will be placed further left /
        further up
      </p>
      {stats.map((category) => (
        <div key={category.id}>
          <h1>
            {category.nameEn} (ID {category.id})
          </h1>
          <Divider />
          <EditCategoryForm category={category} />
          <br />
          {category.NavbarItem.map((item) => (
            <React.Fragment key={item.id}>
              <h3 key={item.id}>{item.nameEn}</h3>
              <EditItemForm item={item} />
            </React.Fragment>
          ))}
          {category.url === '' ? (
            <>
              <h2>Add Item</h2>
              <AddItemForm categoryId={category.id} />
            </>
          ) : (
            <p>Cannot add sub-items when category has a URL</p>
          )}
        </div>
      ))}
      <h1>Add Category</h1>
      <AddCategoryForm />
    </main>
  );
}
