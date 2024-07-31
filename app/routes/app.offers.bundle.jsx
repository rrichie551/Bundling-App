import '../styles/style.css';
import { useNavigate, Form, useNavigation } from '@remix-run/react';
import { Page, FullscreenBar, Text, Button, Card, BlockStack, FormLayout, TextField, Layout, ChoiceList, Banner, InlineError, ResourceList, ResourceItem, Select, Spinner } from '@shopify/polaris';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { DeleteIcon } from '@shopify/polaris-icons';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { authenticate } from "../shopify.server";

export default function BundleDiscount() {
  const navigation = useNavigation();
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [titleError, setTitleError] = useState(false);
  const [ruleError, setRuleError] = useState(false);
  const [productError, setProductError] = useState(false);
  const [bannerError, setBannerError] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    offerDesc: '',
    selected: ['product'],
    selectedRule: ['percentage'],
    selectedDesk: 4,
    selectedMob: 2,
    description: '',
    status: ['active'],
    channels: ['both'],
    products: [],
    variants: [],
    priority: 1,
    startDate: null,
    endDate: null,
    percenDisc: '',
    fixDisc: '',
    widgetTitle: 'Buy together and save',
    btnText: 'Add to Cart'
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleInputChange = useCallback((key, value) => {
    setFormData((prevData) => ({ ...prevData, [key]: value }));
  }, []);

  const resourceName = {
    singular: 'product',
    plural: 'products',
  };

  const handleResourcePicker = async (type) => {
    const selectionIds = formData.products.length > 0 ? formData.products.map(product => ({ id: product.id })) : [];
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
      products: selectedResources
    }));
  };
  
  const getOnClickHandler = useMemo(() => {
    return formData.selected.includes('product') 
      ? () => handleResourcePicker('product') 
      : () => handleResourcePicker('variant');
  }, [formData.selected]);
  

  const promotedBulkActions = useMemo(() => [
    {
      content: 'Delete',
      icon: DeleteIcon,
      destructive: true,
      onAction: () => {
        setFormData((prevData) => ({
          ...prevData,
          products: prevData.products.filter(product => !selectedItems.includes(product.id))
        }));
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
    if (formData.products.length === 0) {
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
                  Bundle Discount
                </Text>
              </div>
              <Button variant="primary" onClick={handleFinalFormSub}>
                {loading ? (
                  <Spinner accessibilityLabel="Small spinner example" size="small" />
                ) : (
                  'Save Bundle'
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
                              { label: 'Product', value: 'product', helpText: "Offer bundle discount on full product." },
                              { label: 'Variants', value: 'variants', helpText: "Offer bundle discount on selected variants instead of full product." },
                            ]}
                            selected={formData.selected}
                            onChange={(value) => handleInputChange('selected', value)}
                          />
                        </BlockStack>
                      </Card>
                      <Card>
                        <BlockStack gap="200">
                          <div className="products-add-top">
                            <Text as="h2" variant="headingSm" fontWeight="semibold">
                              Choose products
                            </Text>
                            <Button variant="plain" onClick={getOnClickHandler}>Add Products</Button>
                          </div>
                          {productError &&
                            <InlineError message="At-least one product is required." fieldID="myFieldID" />
                          }
                          {formData.selected.includes('product') ? (
                            <ResourceList
                              resourceName={resourceName}
                              items={formData.products}
                              renderItem={(item) => {
                                const { id, url, name, location } = item;
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
                            />
                          ) : (
                            <ResourceList
                              resourceName={resourceName}
                              items={formData.products}
                              renderItem={(item) => {
                                const { id, url, name } = item;
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
                            />
                          )}
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
                      <Card>
                        <BlockStack gap="200">
                          <Text as="h2" variant="headingSm" fontWeight="semibold">
                            Bundle box view
                          </Text>
                          <div className="discount-rules-fields">
                            <Select
                              label="Desktop Grid Per Row*"
                              options={[
                                { label: 1, value: 1 },
                                { label: 2, value: 2 },
                                { label: 3, value: 3 },
                                { label: 4, value: 4 }
                              ]}
                              onChange={(value) => handleInputChange('selectedDesk', value)}
                              value={formData.selectedDesk}
                            />
                            <Select
                              label="Mobile Grid Per Row*"
                              options={[
                                { label: 1, value: 1 },
                                { label: 2, value: 2 }
                              ]}
                              onChange={(value) => handleInputChange('selectedMob', value)}
                              value={formData.selectedMob}
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
                              <TextField
                                label="Offer Button Text*"
                                onChange={(value) => handleInputChange('btnText', value)}
                                value={formData.btnText}
                                autoComplete="off"
                              />
                              <TextField
                                label="Offer Widget Title*"
                                onChange={(value) => handleInputChange('widgetTitle', value)}
                                value={formData.widgetTitle}
                                autoComplete="off"
                              />
                            </FormLayout>
                            <div className="offer-view-textarea">
                              <TextField
                                label="Description"
                                value={formData.description}
                                onChange={(value) => handleInputChange('description', value)}
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

