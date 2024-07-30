import '../styles/style.css';
import { useNavigate, Form, redirect, useLoaderData } from '@remix-run/react';
import { Page, FullscreenBar, Text, Button, Card, BlockStack, FormLayout, TextField, Layout, ChoiceList, Banner, InlineError, ResourceList, ResourceItem, Select, Spinner } from '@shopify/polaris';
import { useState, useCallback, useEffect } from 'react';
import {DeleteIcon} from '@shopify/polaris-icons';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";


export const action = async ({ request, params }) => {
const discountId = params ? params.bundle : undefined;
  const formData = await request.formData();
  const session = await prisma.session.findFirst();
    if (!session) {
      throw new Error("No session found. Please ensure you have at least one session in the database.");
    }

  const offerData = {
    title: formData.get('title'),
    offerDesc: formData.get('offerDesc'),
    selected:formData.get('selected'), 
    selectedRule:formData.get('selectedRule'),
    selectedDesk: Number(formData.get('selectedDesk')),
    selectedMob: Number(formData.get('selectedMob')),
    description: formData.get('description'),
    status:formData.get('status'),
    channels:formData.get('channels'), 
    products: formData.get('products'), 
    variants: formData.get('variants'),
    priority: Number(formData.get('priority')),
    startDate: formData.get('startDate') ? new Date(formData.get('startDate')) : new Date(),
    endDate: formData.get('endDate') ? new Date(formData.get('endDate')) : null,
    percenDisc: formData.get('percenDisc'),
    fixDisc: formData.get('fixDisc'),
    widgetTitle: formData.get('widgetTitle'),
    btnText: formData.get('btnText'),
    type: 'Bundle Discount',
    userId: session.id
    
  };

  await prisma.offer.update({
    where: { id: Number(discountId) },
    data: offerData,
  });

  return redirect('/app/offers');
};

export async function loader({params}) {
    const discountId = params ? params.bundle : undefined;
    const session = await prisma.session.findFirst();
    if (!session) {
      throw new Error("No session found. Please ensure you have at least one session in the database.");
    }
    const discountData  = await prisma.offer.findFirst({
        where: {
          id: Number(discountId)
        }
      });
    console.log("This is the data",discountData);  
    return discountData;
  }

export default function BundleEdit() {
  const data = useLoaderData();  
  console.log("This is the data", data)
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [titleError, setTitleError] = useState(false)
  const [ruleError, setRuleError] = useState(false);
  const [productError, setProductError] = useState(false);
  const [bannerError, setBannerError] = useState(false);
  const [formData, setFormData] = useState({
    title: data.title,
    offerDesc: data.offerDesc,
    selected: [`${data.selected}`],
    selectedRule: [`${data.selectedRule}`],
    selectedDesk: data.selectedDesk,
    selectedMob: data.selectedMob,
    description: data.description,
    status: [`${data.status}`],
    channels: [`${data.channels}`],
    products: JSON.parse(data.products),
    variants: JSON.parse(data.variants),
    priority: data.priority,
    startDate: data.startDate,
    endDate: data.endDate,
    percenDisc: data.percenDisc,
    fixDisc: data.fixDisc,
    widgetTitle: data.widgetTitle,
    btnText: data.btnText
  });

  useEffect(() => {
    setIsClient(true);
  }, []);
const handleTitle = useCallback((value) => setFormData((prevData) => ({ ...prevData, title: value })), []);
const handleDesc = useCallback((value) => setFormData((prevData) => ({ ...prevData, offerDesc: value })), []);  
const handleChange = useCallback((value) =>  setFormData((prevData) => ({ ...prevData, selected: value })), []);
const handleStatus = useCallback((value) => setFormData((prevData) => ({ ...prevData, status: value })), []);
const handleChannels = useCallback((value) => setFormData((prevData) => ({ ...prevData, channels: value })), []);
const handleChangeRule = useCallback((value) => setFormData((prevData) => ({ ...prevData, selectedRule: value })), []);
const handleChangeDesk = useCallback((value) => setFormData((prevData) => ({ ...prevData, selectedDesk: Number(value) })), []);
const handlePriority = useCallback((value) => setFormData((prevData) => ({ ...prevData, priority: Number(value) })), []);
const handleChangeMob = useCallback((value) => setFormData((prevData) => ({ ...prevData, selectedMob: Number(value) })), []);
const handleDescriptionChange = useCallback((value) => setFormData((prevData) => ({ ...prevData, description: value })), []);
const handlePercen = useCallback((value) => setFormData((prevData) => ({ ...prevData, percenDisc: value })), []);
const handleWidgetTitle = useCallback((value) => setFormData((prevData) => ({ ...prevData, widgetTitle: value })), []);
const handleBtnText = useCallback((value) => setFormData((prevData) => ({ ...prevData, btnText: value })), []);
const handleStartDate = useCallback((value) => setFormData((prevData) => ({ ...prevData, startDate: value.toISOString() })), []);
const handleEndDate = useCallback((value) => setFormData((prevData) => ({ ...prevData, endDate: value.toISOString() })), []);

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
  const selectedProducts = productsList.map(product => ({
    id: product.id,
    name: product.title,
    url: product.onlineStoreUrl || '#',
    location:`${product.totalVariants} ${product.totalVariants > 1 ? 'Variants' : 'Variant'}`
  }));
  setFormData((prevData) => ({
    ...prevData,
    products: selectedProducts
  }));
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
  const selectedVariants = variantsList.map(variant => ({
    id: variant.id,
    name: variant.title,
    url: variant.onlineStoreUrl || '#'
  }));
  setFormData((prevData) => ({
    ...prevData,
    variants: selectedVariants
  }));
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
  const { title, offerDesc, selected, selectedRule, selectedDesk, selectedMob, description, status, channels, products, variants, priority, startDate, endDate, percenDisc, fixDisc, widgetTitle, btnText } = formData;
  const handleFinalFormSub = useCallback(() => {
    setLoading(true);
    const form = document.getElementById('bundleDiscountForm');
    if(title === ''){
      setTitleError(true);
      setBannerError(true);
      setLoading(false);
      return;
      }
    if(products.length === 0){
      setProductError(true);
      setTitleError(false);
      setBannerError(true);
      setLoading(false);
      return;
    }  
    if(percenDisc === ''){
          setRuleError(true);
          setTitleError(false);
          setBannerError(true);
          setProductError(false);
          setLoading(false);
          return;
    }
    Object.entries(formData).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      if ((key === 'startDate' || key === 'endDate') && value) {
        input.value = value;
      }
      if ((key === 'startDate' || key === 'endDate') && !value) {
        if(key === 'endDate'){
            input.value = null;
          }
          else{
            input.value = '';
          }
      }
      if(key === 'channels' || key === 'status' || key === 'selectedRule' || key === 'selected'){
        input.value = value[0];
        console.log("Final value: " + value[0])
      }
      else if (typeof value === 'object') {
        input.value = JSON.stringify(value);
      } else {
        input.value = value;
      }
      form.appendChild(input);
    });
    console.log("Final Fom before submitting", form);
    form.submit();
  }, [title, products,channels,status,selectedRule,selected, percenDisc, formData]);
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
              <Button variant="primary" onClick={handleFinalFormSub}>
              {loading ? (
                                <Spinner accessibilityLabel="Small spinner example" size="small" />
                                    ) : (
                                    'Update Bundle'
                                )}
              </Button>
          </div>
        </FullscreenBar>
        <Page>
          {bannerError && 
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
          }
          <div className="bundle-discount-form">
            <Form method="post" id="bundleDiscountForm">
              <Layout>
                <Layout.Section>
                <div className="bundle-discount-form-left">
                  <Card>
                    <BlockStack gap="200">
                    <Text as="h2" variant="headingSm" fontWeight="semibold">
                      Offer Details
                    </Text>
                    <FormLayout>
                      <TextField label="Offer Title*" autoComplete="off"  value={title}
                        onChange={handleTitle}   error={titleError ? "Offer title is required" : ""}
                      />
                      <TextField
                        type="email"
                        value={offerDesc}
                        onChange={handleDesc}
                        label="Offer Description (optional)"
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
                      {productError &&
                        <InlineError message="At-least one product is required." fieldID="myFieldID" />
                      }
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
                    const {id, url, name} = item;
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
                        <TextField label="Discount %*" onChange={handlePercen} value={percenDisc} autoComplete="off"  error={ruleError ? "Some value is required" : ""}
                        />:  <TextField label="Fixed Amount Discount*" onChange={handlePercen} value={percenDisc} autoComplete="off"  error={ruleError ? "Some value is required" : ""}
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
                          <TextField label="Offer Button Text*" onChange={handleBtnText} value={btnText} autoComplete="off"  //error="Store name is required"
                          />
                          <TextField label="Offer Widget Title*" onChange={handleWidgetTitle} value={widgetTitle} autoComplete="off"  //error="Store name is required"
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
                          <div className="dates-start">
                            <label >Start Date</label>
                            <DatePicker label="Here is" selected={startDate} onChange={handleStartDate}/>
                          </div>
                          <div className="dates-end">
                          <label>End Date</label>
                            <DatePicker selected={endDate} onChange={handleEndDate}/>
                          </div>
                          <p className='greyP2'>NOTE: No need to select a start date if you want your offer to begin today.</p>
                        </div>
                      }
                      </div>

                  </BlockStack>
                  </Card>
                  </div>
                </div>
                </Layout.Section>
              </Layout>
            </Form>
          </div>
        </Page>
        </div>
      </div> 
  )
}
