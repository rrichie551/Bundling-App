import '../styles/style.css';
import { useNavigate, Form, useNavigation } from '@remix-run/react';
import { Page, FullscreenBar, Text, Button, Card, BlockStack, FormLayout, TextField, Layout, ChoiceList, Banner, InlineError, ResourceList, ResourceItem, Select, Spinner } from '@shopify/polaris';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { DeleteIcon } from '@shopify/polaris-icons';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { authenticate } from "../shopify.server";

export default function VolumeDiscount() {
  const navigation = useNavigation();
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [titleError, setTitleError] = useState(false);
  const [ruleError, setRuleError] = useState(false);
  const [productError, setProductError] = useState(false);
  const [bannerError, setBannerError] = useState(false);
  const [levelError, setLevelError] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    amount: '1.00',
    offerDesc: '',
    selected: ['product'],
    options: ['all'],
    selectedRule: ['exactM'],
    status: ['active'],
    channels: ['both'],
    resources: [],
    priority: 1,
    discountLevels: [{ quantity: '', discountType: 'fixed', discountValue: '' }],
    startDate: null,
    endDate: null,
    percenDisc: '',
    fixDisc: ''
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleInputChange = useCallback((key, value) => {
    if(key === 'selected'){
        setFormData((prevData) => ({ ...prevData, resources:[] }));
        setFormData((prevData) => ({ ...prevData, [key]:value }));
    }
    else if(key === 'options'){
      setFormData((prevData) => ({ ...prevData, resources:[] }));
      setFormData((prevData) => ({ ...prevData, [key]:value }));
    }
    else if(key === 'selectedRule'){

    }
    else{
        setFormData((prevData) => ({ ...prevData, [key]: value }));
    }
   
  }, []);  

  const handleAddLevel = useCallback(() => {
    const hasEmptyFields = formData.discountLevels.some(level =>
      level.quantity === '' || level.discountType === '' || level.discountValue === ''
    );
  
    if (hasEmptyFields) {
      setLevelError(true);
      return;
    } else {
      setLevelError(false);
    }

    const newLevel = {
      quantity: '',
      discountType: '',
      discountValue: ''
    };
    setFormData((prevData) => ({
      ...prevData,
      discountLevels: [...prevData.discountLevels, newLevel]
    }));
  }, [setFormData]);
  
  const handleLevelChange = useCallback((index, key, value) => {
    const newLevels = [...formData.discountLevels];
    console.log(
      "This is the new level",
       newLevels[0].discountType
    )
    newLevels[index][key] = value;
    setFormData((prevData) => ({
      ...prevData,
      discountLevels: newLevels
    }));
  }, [formData.discountLevels, setFormData]);

  const resourceName = {
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
  
  const getOnClickHandler = useMemo(() => {
    if (formData.selected.includes('product')) {
      return () => handleResourcePicker('product');
    } else if (formData.selected.includes('variants')) {
      return () => handleResourcePicker('variant');
    } else if (formData.selected.includes('collections')) {
      return () => handleResourcePicker('collection');
    }
  }, [formData.selected]);
  

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
    if (formData.resources.length === 0) {
      setProductError(true);
      setTitleError(false);
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
                  Volume/Bulk Discount
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
                              { label: 'Product', value: 'product', helpText: "You can select the full product for the volume discount" },
                              { label: 'Variant', value: 'variants', helpText: "Instead of selecting the entire product, you can choose specific variants of the product." },
                              { label: 'Collection', value: 'collections', helpText: "Instead of selecting the entire product or variant, you can choose a specific collection" },
                              { label: 'Cart Quantity', value: 'quantity', helpText: "Volume discount based on cart quantity" }
                            ]}
                            selected={formData.selected}
                            onChange={(value) => handleInputChange('selected', value)}
                          />
                        </BlockStack>
                      </Card>
                      {formData.selected.includes('quantity') ? <></>:
                      <Card>
                        <BlockStack gap="200">
                          <Text as="h2" variant="headingSm" fontWeight="semibold">
                            Product Options
                          </Text>
                          <ChoiceList
                            choices={[
                              { label: 'All', value: 'all' },
                              { label: 'Custom Selection', value: 'custom' }
                            ]}
                            selected={formData.options}
                            onChange={(value) => handleInputChange('options', value)}
                          />
                        </BlockStack>
                      </Card>
                      }
                      {formData.options.includes('all') || formData.selected.includes('quantity') ? <></> : 
                      <Card>
                      <BlockStack gap="200">
                        <div className="products-add-top">
                          <Text as="h2" variant="headingSm" fontWeight="semibold">
                            {formData.selected.includes('product') && <>Choose products</> }
                            {formData.selected.includes('variants') && <>Choose products</> }
                            {formData.selected.includes('collections') && <>Choose collections</> }
                          </Text>
                          <Button variant="plain" onClick={getOnClickHandler}>
                          {formData.selected.includes('product') && <> Add Products</> }
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
                         
                            <ChoiceList
                              choices={[
                                { label: 'Apply to exact or more than quantity (Volume)', value: 'exactM' },
                                { label: 'Apply to only exact quantity (Bulk)', value: 'exact' },
                                { label: 'Apply to on bulk series like 2,4,6,8 etc', value: 'series' },
                              ]}
                              selected={formData.selectedRule}
                              onChange={(value) => handleInputChange('selectedRule', value)}
                            />
                        
                          <div className="discount-rules-fileds">
                            <FormLayout>
                            {formData.discountLevels.map((level, index) => (
                              <div key={index} className="volume-discount-fields">
                              <TextField label="Quantity*" autoComplete="off" 
                                value={level.quantity}
                                onChange={(value) => handleLevelChange(index, 'quantity', value)}
                                error={levelError ? "add" : ""}
                              />
                              <div>
                                  <Select
                                  label="Discount Type*"
                                  options={[
                                    { label: 'Percentage Discount', value: 'percentage' },
                                    { label: 'Fixed Amount Discount', value: 'fixed' },
                                    { label: 'Fixed Product Price', value: 'product' }
                                  ]}
                                  value={level.discountType}
                                  onChange={(value) => handleLevelChange(index, 'discountType', value)}
                                />
                            </div>
                            <TextField label="Discount Value*" autoComplete="off"
                              value={level.discountValue}
                              onChange={(value) => handleLevelChange(index, 'discountValue', value)}
                              error={levelError ? "add" : ""}
                              />
                           
                              </div>
                                ))}
                              <Button onClick={handleAddLevel} variant="primary">Add Level</Button>
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
                            Priority
                          </Text>
                          <div className="discount-rules-fields">
                            <Select
                              options={[
                                { label: 1, value: 1 },
                                { label: 2, value: 2 },
                                { label: 3, value: 3 },
                                { label: 4, value: 4 }
                              ]}
                              onChange={(value) => handleInputChange('priority', value)}
                              value={formData.priority}
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

export const action = async ({ request }) => {
  const { admin,redirect } = await authenticate.admin(request);
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
    startDate: formData.get('startDate') === 'null' ? new Date() : new Date(formData.get('startDate')),
    endDate: formData.get('endDate') === 'null' ? null :  new Date(formData.get('endDate')),
    percenDisc: formData.get('percenDisc'),
    fixDisc: formData.get('fixDisc'),
    widgetTitle: formData.get('widgetTitle'),
    btnText: formData.get('btnText'),
    type: 'Bundle Discount',
    userId: session.id
    
  };

  await prisma.bundle.create({ data: offerData });

  return redirect('/app/offers');
};

