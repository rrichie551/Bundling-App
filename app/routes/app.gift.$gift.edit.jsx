import '../styles/style.css';
import { useNavigate, Form, useNavigation, useLoaderData } from '@remix-run/react';
import { Page, FullscreenBar, Text, Button, Card, BlockStack, FormLayout, TextField, Layout, ChoiceList, Banner, InlineError, ResourceList, ResourceItem, Select, Spinner } from '@shopify/polaris';
import { useState, useCallback, useEffect, useMemo } from 'react';
import {DeleteIcon} from '@shopify/polaris-icons';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { authenticate } from "../shopify.server";

export async function loader({params}) {
    const discountId = params ? params.gift : undefined;
    const session = await prisma.session.findFirst();
    if (!session) {
      throw new Error("No session found. Please ensure you have at least one session in the database.");
    }
    const discountData  = await prisma.gift.findFirst({
        where: {
          id: Number(discountId)
        }
      });
    return discountData;
  }


export default function FreeGiftEdit() {
  const navigation = useNavigation();
  const data = useLoaderData();
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedItemsG, setSelectedItemsG] = useState([]);
  const [titleError, setTitleError] = useState(false)
  const [ruleError, setRuleError] = useState(false);
  const [productError, setProductError] = useState(false);
  const [productErrorG, setProductErrorG] = useState(false);
  const [bannerError, setBannerError] = useState(false);
  const [formData, setFormData] = useState({
    title: data?.title,
    offerDesc: data?.offerDesc,
    amount: data?.amount,
    selected: [`${data?.selected}`],
    selectedRule: [`${data?.selectedRule}`],
    status: [`${data?.status}`],
    channels: [`${data?.channels}`],
    resources: JSON.parse(data?.resources),
    giftProducts: JSON.parse(data?.giftProducts),
    upsell:[`${data?.upsell}`],
    behavior:[`${data?.behavior}`],
    startDate: data?.startDate,
    endDate: data?.endDate,
    percenDisc: data?.percenDisc,
    fixDisc: data?.fixDisc
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleInputChange = useCallback((key, value) => {
    if(key === 'selected'){
        setFormData((prevData) => ({ ...prevData, resources:[] }));
        setFormData((prevData) => ({ ...prevData, [key]:value }));
    }
    else{
        setFormData((prevData) => ({ ...prevData, [key]: value }));
    }
   
  }, []);  

const resourceName = {
singular: formData.selected.includes('collections') ? 'collection' : 'product',
plural: formData.selected.includes('collections') ? 'collections' : 'products',
};
const resourceName2 = {
    singular: 'product',
    plural: 'products',
    };

const handleResourcePicker = async (type) => {
    const selectionIds = formData.resources.length > 0 ? formData.resources.map(product => ({ id: product.id })) : [];
    const resourceList = await window.shopify.resourcePicker({
      type: type,
      filter: {
        hidden: false,
        variants: false,
        draft: false,
        archived: false,
      },
      selectionIds,
      action: "add",
      multiple: true
    });
  
    const selectedResources = resourceList.map(resource => ({
      id: resource.id,
      name: resource.title,
      url: resource.onlineStoreUrl || '#',
      location: type === 'product' ? `${resource.totalVariants} ${resource.totalVariants > 1 ? 'Variants' : 'Variant'}` : undefined
    }));
  
    setFormData((prevData) => ({
      ...prevData,
      resources: selectedResources
    }));
  };

  const handleGiftProduct = async () => {
    const selectionIds = formData.giftProducts.length > 0 ? formData.giftProducts.map(product => ({ id: product.id })) : [];
    const resourceList = await window.shopify.resourcePicker({
      type: 'product',
      filter: {
        hidden: false,
        variants: true,
        draft: false,
        archived: false,
      },
      selectionIds,
      action: "add",
      multiple: true
    });
  
    const selectedResources = resourceList.map(resource => ({
      id: resource.id,
      name: resource.title,
      url: resource.onlineStoreUrl || '#',
      location: `${resource.totalVariants} ${resource.totalVariants > 1 ? 'Variants' : 'Variant'}`
    }));
  
    setFormData((prevData) => ({
      ...prevData,
      giftProducts: selectedResources
    }));
    console.log("Selected Resources", formData.giftProducts);
  }; 

  const promotedBulkActions = useMemo(() => [
    {
      content: 'Delete',
      icon: DeleteIcon,
      destructive: true,
      onAction: () => {
        setFormData((prevData) => ({
          ...prevData,
          resources: prevData.resources.filter(product => !selectedItems.includes(product.id))
        }));
        setSelectedItems([]); 
      }
    }
  ], [selectedItems]);

  const promotedBulkActionsG = useMemo(() => [
    {
      content: 'Delete',
      icon: DeleteIcon,
      destructive: true,
      onAction: () => {
        setFormData((prevData) => ({
          ...prevData,
          giftProducts: prevData.giftProducts.filter(product => !selectedItemsG.includes(product.id))
        }));
        setSelectedItemsG([]); 
      }
    }
  ], [selectedItemsG]);

  const getOnClickHandler = useMemo(() => {
    if (formData.selected.includes('products')) {
      return () => handleResourcePicker('product');
    } else if (formData.selected.includes('variants')) {
      return () => handleResourcePicker('variant');
    } else if (formData.selected.includes('collections')) {
      return () => handleResourcePicker('collection');
    }
  }, [formData.selected]);


  const navigate = useNavigate();
  const handleFinalFormSub = useCallback(() => {
    setLoading(true);
    const form = document.getElementById('bundleDiscountForm');
    if (formData.title === '') {
      setTitleError(true);
      setBannerError(true);
      setLoading(false);
      return;
    }
    if(!formData.selected.includes('allProducts')){
    if (formData.resources.length === 0) {
      setProductError(true);
      setTitleError(false);
      setBannerError(true);
      setLoading(false);
      return;
    }
}
    if (formData.giftProducts.length === 0) {
        setProductErrorG(true);
        setTitleError(false);
        setProductError(false);
        setBannerError(true);
        setLoading(false);
        return;
      }
    if (formData.percenDisc === '') {
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
        input.value = null;
      }
      if (key === 'channels' || key === 'status' || key === 'selectedRule' || key === 'selected') {
        input.value = value[0];
      } else if (typeof value === 'object') {
        input.value = JSON.stringify(value);
      } else {
        input.value = value;
      }
      form.appendChild(input);
    });
    form.submit();
  }, [formData]);
  return (
    <div className="bundle-discount-page">
    {navigation.state !== "idle" ? <div className="loader-spinner"><Spinner accessibilityLabel="Spinner example" size="large" /></div> : <>
      <div className="bundle-discount-page-cont">
        <FullscreenBar onAction={() => { navigate("../offers") }}>
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
            <div style={{ marginLeft: '1rem', flexGrow: 1 }}>
              <Text variant="headingLg" as="p">
                Free Gift
              </Text>
            </div>
            <Button variant="primary" onClick={handleFinalFormSub}>
              {loading ? (
                <Spinner accessibilityLabel="Small spinner example" size="small" />
              ) : (
                'Save'
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
                          <TextField label="Offer Title*" autoComplete="off" value={formData.title}
                            onChange={(value) => handleInputChange('title', value)} error={titleError ? "Offer title is required" : ""}
                          />
                          <TextField
                            type="email"
                            value={formData.offerDesc}
                            onChange={(value) => handleInputChange('offerDesc', value)}
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
                            { label: 'All products', value: 'allProducts', helpText: "Applies on all the products in the store." },
                            { label: 'Product', value: 'products', helpText: "Selected products only" },
                            { label: 'Variant', value: 'variants', helpText: "Selected variants only" },
                            { label: 'Collection', value: 'collections', helpText: "Selected collections only" },
                          ]}
                          selected={formData.selected}
                          onChange={(value) => handleInputChange('selected', value)}
                        />
                      </BlockStack>
                    </Card>
                    {formData.selected.includes('allProducts') ? <></> : 
                    <Card>
                      <BlockStack gap="200">
                        <div className="products-add-top">
                          <Text as="h2" variant="headingSm" fontWeight="semibold">
                            {formData.selected.includes('products') && <>Choose products</> }
                            {formData.selected.includes('variants') && <>Choose products</> }
                            {formData.selected.includes('collections') && <>Choose collections</> }
                          </Text>
                          <Button variant="plain" onClick={getOnClickHandler}>
                          {formData.selected.includes('products') && <> Add Products</> }
                          {formData.selected.includes('variants') && <> Add Products</> }
                          {formData.selected.includes('collections') && <> Add Collections</> }
                        </Button>
                        </div>
                        {productError &&
                          <InlineError message="At-least one product is required." fieldID="myFieldID" />
                        }
                          <ResourceList
                            resourceName={resourceName}
                            items={formData.resources}
                            renderItem={(item) => {
                              const { id, name, location } = item;
                              return (
                                <div className='products-list-item'>
                                  <ResourceItem
                                    id={id}
                                    accessibilityLabel={`View details for ${name}`}
                                  >
                                    <Text variant="bodyMd" fontWeight="bold" as="h3">
                                      {name}
                                    </Text>
                                    {formData.selected.includes('products') && <div><i>{location}</i></div>}
                                  </ResourceItem>
                                </div>
                              );
                            }}
                            selectedItems={selectedItems}
                            onSelectionChange={setSelectedItems}
                            promotedBulkActions={promotedBulkActions}
                          />
                      </BlockStack>
                    </Card>
                    }
                     <Card>
                      <BlockStack gap="200">
                        <div className="products-add-top">
                          <Text as="h2" variant="headingSm" fontWeight="semibold">
                            Choose gift products
                          </Text>
                          <Button variant="plain" onClick={handleGiftProduct}>
                            Add Products
                        </Button>
                        </div>
                        {productErrorG &&
                          <InlineError message="At-least one product is required." fieldID="myFieldID" />
                        }
                          <ResourceList
                            resourceName={resourceName2}
                            items={formData.giftProducts}
                            renderItem={(item) => {
                              const { id, name, location } = item;
                              return (
                                <div className='products-list-item'>
                                  <ResourceItem
                                    id={id}
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
                            selectedItems={selectedItemsG}
                            onSelectionChange={setSelectedItemsG}
                            promotedBulkActions={promotedBulkActionsG}
                          />
                      </BlockStack>
                    </Card>
                    <Card>
                      <BlockStack gap="200">
                        <Text as="h2" variant="headingSm" fontWeight="semibold">
                        Offer threshold
                        </Text>
                        <FormLayout>
                          <TextField label="Minimum Cart Subtotal (Threshold Amount)*" autoComplete="off" value={formData.amount}
                            onChange={(value) => handleInputChange('amount', value)} 
                          />
                          <p className='greyP2'>It will verify the cart total before applying any discounts.</p>
                        </FormLayout>
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
                              { label: 'Percentage Discount', value: 'percentage' },
                              { label: 'Fixed Amount Discount', value: 'fixed' },
                            ]}
                            selected={formData.selectedRule}
                            onChange={(value) => handleInputChange('selectedRule', value)}
                          />
                        </div>
                        <div className="discount-rules-fileds">
                          <FormLayout>
                            {formData.selectedRule.includes('percentage') ? (
                              <TextField
                                label="Discount %*"
                                onChange={(value) => handleInputChange('percenDisc', value)}
                                value={formData.percenDisc}
                                autoComplete="off"
                                error={ruleError ? "Some value is required" : ""}
                              />
                            ) : (
                              <TextField
                                label="Fixed Amount Discount*"
                                onChange={(value) => handleInputChange('fixDisc', value)}
                                value={formData.fixDisc}
                                autoComplete="off"
                                error={ruleError ? "Some value is required" : ""}
                              />
                            )}
                          </FormLayout>
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
                            { label: 'Active', value: 'active' },
                            { label: 'Inactive', value: 'inactive' }
                          ]}
                          selected={formData.status}
                          onChange={(value) => handleInputChange('status', value)}
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
                            { label: 'Online Store & POS (both)', value: 'both' },
                            { label: 'Online Store', value: 'online' },
                            { label: 'Point of Sale', value: 'pos' }
                          ]}
                          selected={formData.channels}
                          onChange={(value) => handleInputChange('channels', value)}
                        />
                      </BlockStack>
                    </Card>
                    <Card>
                      <BlockStack gap="200">
                        <Text as="h2" variant="headingSm" fontWeight="semibold">
                        Show an upsell popup on cart page
                        </Text>
                        <ChoiceList
                          choices={[
                            { label: 'Yes', value: 'yes' },
                            { label: 'No', value: 'no' }
                          ]}
                          selected={formData.upsell}
                          onChange={(value) => handleInputChange('upsell', value)}
                        />
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
                                  <label>Start Date</label>
                                  <DatePicker selected={formData.startDate} onChange={(date) => handleInputChange('startDate', date ? date.toISOString() : null)} />
                                </div>
                                <div className="dates-end">
                                  <label>End Date</label>
                                  <DatePicker selected={formData.endDate} onChange={(date) => handleInputChange('endDate', date ? date.toISOString() : null)} />
                                </div>
                                <p className='greyP2'>NOTE: No need to select a start date if you want your offer to begin today.</p>
                              </div>
                            }
                          </div>
                        </BlockStack>
                      </Card>
                    </div>
                    <Card>
                      <BlockStack gap="200">
                        <Text as="h2" variant="headingSm" fontWeight="semibold">
                        Discount behavior
                        </Text>
                        <p className='greyP'>Evaluates the next free gift discount behavior.</p>
                        <ChoiceList
                          choices={[
                            { label: 'Continue', value: 'continue', helpText: "This will continue assessing subsequent gift discounts." },
                            { label: 'Discontinue', value: 'discontinue', helpText: "This will stop further checks for additional gift discounts." }
                          ]}
                          selected={formData.behavior}
                          onChange={(value) => handleInputChange('behavior', value)}
                        />
                      </BlockStack>
                    </Card>
                  </div>
                </Layout.Section>
              </Layout>
            </Form>
          </div>
        </Page>
      </div>
      </>}
    </div> 
  )
}

export const action = async ({ request, params }) => {
  const { admin,redirect } = await authenticate.admin(request);
  const discountId = params ? params.bundle : undefined;
  const formData = await request.formData();
  const session = await prisma.session.findFirst();
    if (!session) {
      throw new Error("No session found. Please ensure you have at least one session in the database.");
    }

  const offerData = {
    title: formData.get('title'),
    amount: formData.get('amount'),
    offerDesc: formData.get('offerDesc'),
    selected:formData.get('selected'), 
    selectedRule:formData.get('selectedRule'),
    status:formData.get('status'),
    channels:formData.get('channels'), 
    resources: formData.get('resources'),
    giftProducts: formData.get('giftProducts'),
    upsell:formData.get('upsell'),
    behavior:formData.get('behavior'),
    startDate: formData.get('startDate') === 'null' ? new Date() : new Date(formData.get('startDate')),
    endDate: formData.get('endDate') === 'null' ? null :  new Date(formData.get('endDate')),
    percenDisc: formData.get('percenDisc'),
    fixDisc: formData.get('fixDisc'),
    type: 'Free Gift',
    userId: session.id
    
  };

  await prisma.gift.update({
    where: { id: Number(discountId) },
    data: offerData,
  });

  return redirect('/app/offers');
};

