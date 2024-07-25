import '../styles/style.css';
import { useNavigate } from '@remix-run/react';
import { Page, FullscreenBar, Text, Button, Card, BlockStack, FormLayout, TextField, Layout, ChoiceList, Banner, InlineError, ResourceList, ResourceItem } from '@shopify/polaris';
import { useState, useCallback } from 'react';
import {DeleteIcon} from '@shopify/polaris-icons';

export default function BundleDiscount() {
  const [selected, setSelected] = useState(['product']);
  const [selectedRule, setSelectedRule] = useState(['percentage']);
  const [products, setProducts] = useState([]);
  const [variants, setVariants] = useState([]);

  console.log("BHai yeh hai value", selected);

const handleChange = useCallback((value) => setSelected(value), []);
const handleChangeRule = useCallback((value) => setSelectedRule(value), []);
const [selectedItems, setSelectedItems] = useState([]);

const resourceName = {
singular: 'product',
plural: 'products',
};

const  handleProducts = async ()=>{
  const productsList = await window.shopify.resourcePicker({
    type: "product",
    filter: {
      hidden: false,
      variants: false,
      draft: false,
      archived: false,
    },
    action: "add", 
    multiple: true
  });
  console.log(productsList);
  const selectedProducts = productsList.map(product => ({
    id: product.id,
    name: product.title,
    url: product.onlineStoreUrl || '#',
    location:`${product.totalVariants} ${product.totalVariants > 1 ? 'Variants' : 'Variant'}`
  }));
  console.log(selectedProducts,"These are the selected products");
  setProducts([...products, ...selectedProducts]);
}

const  handleVariants = async ()=>{
  const variantsList = await window.shopify.resourcePicker({
    type: "variant",
    filter: {
      hidden: false,
      draft: false,
      archived: false,
    },
    action: "add", 
    multiple: true
  });
  console.log(variantsList);
  const selectedVariants = variantsList.map(variant => ({
    id: variant.id,
    name: variant.title,
    url: variant.onlineStoreUrl || '#'
  }));
  console.log(selectedVariants,"These are the selected products");
  setVariants([...variants, ...selectedVariants]);
}

const promotedBulkActions = [
{
  content: 'Edit customers',
  onAction: () => console.log('Todo: implement bulk edit'),
},
];

const bulkActions = [
{
  content: 'Add tags',
  onAction: () => console.log('Todo: implement bulk add tags'),
},
{
  content: 'Remove tags',
  onAction: () => console.log('Todo: implement bulk remove tags'),
},
{
  icon: DeleteIcon,
  destructive: true,
  content: 'Delete customers',
  onAction: () => console.log('Todo: implement bulk delete'),
},
];
const getOnClickHandler = () => {
  if (selected.includes('product')) {
    return handleProducts;
  } else {
    return handleVariants;
  }
};
  const navigate = useNavigate();
  return (
    <div className="bundle-discount-page">
      <div className="bundle-discount-page-cont">
        <FullscreenBar onAction={()=>{navigate("../offers")}}>
          <div
            style={{
              display: 'flex',
              flexGrow: 1,
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingLeft: '1rem',
              paddingRight: '1rem',
            }}
          >
            <div style={{marginLeft: '1rem', flexGrow: 1}}>
              <Text variant="headingLg" as="p">
                Bundle Discount
              </Text>
            </div>
              <Button variant="primary" onClick={() => {}}>
                Save Bundle
              </Button>
  
          </div>
        </FullscreenBar>
        <Page>
          <div className="error-banner">
            <Banner
                title="Validation Error"
                tone="critical"
              >
                <p>
                There are some required fields are missing OR Invalid field values added.
                </p>
              </Banner>
          </div>
          <div className="bundle-discount-form">
          <Layout>
            <Layout.Section>
            <div className="bundle-discount-form-left">
              <Card>
                <BlockStack gap="200">
                <Text as="h2" variant="headingSm" fontWeight="semibold">
                  Offer Details
                </Text>
                <FormLayout>
                  <TextField label="Offer Title*" onChange={() => {}} autoComplete="off"  //error="Store name is required"
                  />
                  <TextField
                    type="email"
                    label="Offer Description (optional)"
                    onChange={() => {}}
                    autoComplete="email"
                  />
                </FormLayout>
              </BlockStack>
              </Card>
              <Card>
                <BlockStack gap="200">
                <Text as="h2" variant="headingSm" fontWeight="semibold">
                  Applies To
                </Text>
                 <ChoiceList
                    choices={[
                      {label: 'Product', value: 'product',  helpText: "Offer bundle discount on full product."},
                      {label: 'Variants', value: 'variants',  helpText: "Offer bundle discount on selected variants instead of full product."},
                    ]}
                    selected={selected}
                    onChange={handleChange}
                  />
              </BlockStack>
              </Card>
              <Card>
                <BlockStack gap="200">
                  <div className="products-add-top">
                  <Text as="h2" variant="headingSm" fontWeight="semibold">
                  Choose products
                  </Text>
                  <Button variant="plain" onClick={getOnClickHandler()}>Add Products</Button>
                  </div>
                <InlineError message="At-least one product is required." fieldID="myFieldID" />
                {
                selected.includes('product') ?   <ResourceList
                resourceName={resourceName}
                items={products}
                renderItem={(item) => {
                  const {id, url, name, location} = item;
                  return (
                    <div className='products-list-item'>
                    <ResourceItem
                      id={id}
                      url={url}
                      accessibilityLabel={`View details for ${name}`}
                    >
                      <Text variant="bodyMd" fontWeight="bold" as="h3">
                        {name}
                      </Text>
                      <div><i>{location}</i></div>
                    </ResourceItem>
                    </div>
                  );
                }}
                selectedItems={selectedItems}
                onSelectionChange={setSelectedItems}
                promotedBulkActions={promotedBulkActions}
                bulkActions={bulkActions}
              /> : <ResourceList
              resourceName={resourceName}
              items={variants}
              renderItem={(item) => {
                const {id, url, name, location} = item;
                return (
                  <div className='products-list-item'>
                  <ResourceItem
                    id={id}
                    url={url}
                    accessibilityLabel={`View details for ${name}`}
                  >
                    <Text variant="bodyMd" fontWeight="bold" as="h3">
                      {name}
                    </Text>
                  </ResourceItem>
                  </div>
                );
              }}
              selectedItems={selectedItems}
              onSelectionChange={setSelectedItems}
              promotedBulkActions={promotedBulkActions}
              bulkActions={bulkActions}
            />

                }
                

                    
              </BlockStack>
              </Card>
              <Card>
                <BlockStack gap="200">
                <Text as="h2" variant="headingSm" fontWeight="semibold">
                  Discount Rule
                </Text>
                 <ChoiceList
                    choices={[
                      {label: 'Percentage Discount', value: 'percentage'},
                      {label: 'Fixed Amount Discount', value: 'fixed'},
                    ]}
                    selected={selectedRule}
                    onChange={handleChangeRule}
                  />
              </BlockStack>
              </Card>
            </div>
            </Layout.Section>
            <Layout.Section variant="oneThird">
            <div className="bundle-discount-form-right"></div>
            </Layout.Section>
          </Layout>
          </div>
        </Page>
        </div>
      </div> 
  )
}
