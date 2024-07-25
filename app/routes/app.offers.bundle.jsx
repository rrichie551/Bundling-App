import '../styles/style.css';
import { useNavigate } from '@remix-run/react';
import { Page, FullscreenBar, Text, Button, Card, BlockStack, FormLayout, TextField, Layout, ChoiceList, Banner, InlineError, ResourceList, ResourceItem, Select } from '@shopify/polaris';
import { useState, useCallback, useEffect } from 'react';
import {DeleteIcon} from '@shopify/polaris-icons';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";


export default function BundleDiscount() {
  const [selected, setSelected] = useState(['product']);
  const [selectedRule, setSelectedRule] = useState(['percentage']);
  const [selectedDesk, setSelectedDesk] = useState(4);
  const [selectedMob, setSelectedMob] = useState(2);
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState(['active']);
  const [channels, setChannels] = useState(['both']);
  const [products, setProducts] = useState([]);
  const [variants, setVariants] = useState([]);
  const [priority, setPriority] = useState(1);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
const handleChange = useCallback((value) => setSelected(value), []);
const handleStatus = useCallback((value) => setStatus(value), []);
const handleChannels = useCallback((value) => setChannels(value), []);
const handleChangeRule = useCallback((value) => setSelectedRule(value), []);
const handleChangeDesk = useCallback((value) => {
  setSelectedDesk(Number(value));
}, []);

const handlePriority = useCallback((value) => {
  setPriority(Number(value))
}, []);
const handleChangeMob = useCallback((value) => {
  setSelectedMob(Number(value));
}, []);

const handleDescriptionChange = useCallback((value) => {
  setDescription(value);
}, []);
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
                <div className="dicount-rules-block">
                  <ChoiceList
                      choices={[
                        {label: 'Percentage Discount', value: 'percentage'},
                        {label: 'Fixed Amount Discount', value: 'fixed'},
                      ]}
                      selected={selectedRule}
                      onChange={handleChangeRule}
                    />
                  </div>
                  <div className="discount-rules-fileds">
                  <FormLayout>
                    {selectedRule.includes('percentage') ?
                     <TextField label="Discount %*" onChange={() => {}} autoComplete="off"  //error="Store name is required"
                     />:  <TextField label="Fixed Amount Discount*" onChange={() => {}} autoComplete="off"  //error="Store name is required"
                     />
                    }
                 
                  </FormLayout>
                  </div>
              </BlockStack>
              </Card>
              <Card>
                <BlockStack gap="200">
                <Text as="h2" variant="headingSm" fontWeight="semibold">
                  Bundle box view
                </Text>
                  <div className="discount-rules-fields">
                  <Select
                      label="Desktop Grid Per Row*"
                      options={[
                        {label: 1, value: 1},
                        {label: 2, value: 2},
                        {label: 3, value: 3},
                        {label: 4, value: 4}
                      ]}
                      onChange={handleChangeDesk}
                      value={selectedDesk}
                    />
                    <Select
                      label="Mobile Grid Per Row*"
                      options={[
                        {label: 1, value: 1},
                        {label: 2, value: 2}
                      ]}
                      onChange={handleChangeMob}
                      value={selectedMob}
                    />
                  </div>
              </BlockStack>
              </Card>
              <Card>
                <BlockStack gap="200">
                <Text as="h2" variant="headingSm" fontWeight="semibold">
                  Offer Details
                </Text>
                <div className="offer-view-block">
                    <FormLayout>
                      <TextField label="Offer Button Text*" onChange={() => {}} autoComplete="off"  //error="Store name is required"
                      />
                      <TextField label="Offer Widget Title*" onChange={() => {}} autoComplete="off"  //error="Store name is required"
                      />
                    </FormLayout>
                    <div className="offer-view-textarea">
                    <TextField
                          label="Description"
                          value={description}
                          onChange={handleDescriptionChange}
                          multiline={4}
                          autoComplete="off"
                        />
                        </div>
                  </div>
              </BlockStack>
              </Card>
              <Card>
                <BlockStack gap="200">
                <Text as="h2" variant="headingSm" fontWeight="semibold">
                  Bundle Preview
                </Text>
                <div className="bundle-preview-box">
                  <div className="bundle-preview-box-top"></div>
                  <div className="bundle-preview-box-total-btn">
                    <div className="bundle-preview-box-total">
                      Total Price : <span className='price'>Rs:0.00</span> <span className='discount'><strike>Rs:0.00</strike></span>
                    </div>
                    <div className="bundle-preview-box-btn">
                      <Button variant="primary">Add To Cart</Button>
                    </div>
                  </div>
                </div>
              </BlockStack>
              </Card>
            </div>
            </Layout.Section>
            <Layout.Section variant="oneThird">
            <div className="bundle-discount-form-right">
              <Card>
                <BlockStack gap="200">
                <Text as="h2" variant="headingSm" fontWeight="semibold">
                  Status
                </Text>
                 <ChoiceList
                    choices={[
                      {label: 'Active', value: 'active'},
                      {label: 'Inactive', value: 'inactive'}
                    ]}
                    selected={status}
                    onChange={handleStatus}
                  />
              </BlockStack>
              </Card>
              <Card>
                <BlockStack gap="200">
                <Text as="h2" variant="headingSm" fontWeight="semibold">
                  Offer channels
                </Text>
                <p className='greyP'>Offer will only work on selected sales channel.</p>
                 <ChoiceList
                    choices={[
                      {label: 'Online Store & POS (both)', value: 'both'},
                      {label: 'Online Store', value: 'online'},
                      {label: 'Point of Sale', value: 'pos'}
                    ]}
                    selected={channels}
                    onChange={handleChannels}
                  />
              </BlockStack>
              </Card>
              <Card>
                <BlockStack gap="200">
                <Text as="h2" variant="headingSm" fontWeight="semibold">
                  Priority
                </Text>
                  <div className="discount-rules-fields">
                  <Select
                      options={[
                        {label: 1, value: 1},
                        {label: 2, value: 2},
                        {label: 3, value: 3},
                        {label: 4, value: 4}
                      ]}
                      onChange={handlePriority}
                      value={priority}
                    />
                  </div>
                  <p className='greyP2'>In case a product/variant is present in two different bundles, the bundle with the highest priority (lowest number) will be shown and applied.</p>
              </BlockStack>
              </Card>
              <div className="publishing-date-card-box">
              <Card>
                <BlockStack gap="200">
                <Text as="h2" variant="headingSm" fontWeight="semibold">
                  Publishing date
                </Text>
                  <div className="discount-rules-fields">
                  {isClient && 
                    <div className="dates-start-end">
                    <DatePicker selected={startDate} onChange={(date) => setStartDate(date)}/>
                    <DatePicker selected={endDate} onChange={(date) => setEndDate(date)}/>
                    </div>
                  }
                  </div>

              </BlockStack>
              </Card>
              </div>
            </div>
            </Layout.Section>
          </Layout>
          </div>
        </Page>
        </div>
      </div> 
  )
}
