import { format } from "date-fns";
import { Page, ButtonGroup, Button, DataTable, EmptyState, Modal, Frame, Card, Text, ResourceList, ResourceItem, Avatar, Badge, Spinner, Link } from '@shopify/polaris';
import { useLoaderData, useNavigation } from "@remix-run/react";
import prisma from '../db.server';
import {useState, useCallback} from 'react';
import '../styles/style.css';

export async function loader() {
 
   const sessions = await prisma.offer.findMany();
    return{
        data: sessions
    }
  }
  
  function formatDate(dateString) {
    const date = new Date(dateString);
    return format(date, "dd MMM 'at' hh:mm a");
  }
export default function Offers() {
    const navigation = useNavigation();
    const {data: sessions } = useLoaderData();
    const rows = sessions.map((session) => [
        <>
          <Link monochrome url={`/app/offers/${session.id}/edit`}>{session.title}</Link> (#{session.id})
        </>, 
        session.type, 
        <div className="offer-on-bundle">{session.selected}</div>, 
        formatDate(session.startDate), 
        formatDate(session.endDate), 
        session.priority, 
        <Badge tone={session.status === 'active' ? 'success' : 'complete'}>{session.status}</Badge>, 
        <div className="offer-on-bundle">{session.channels}</div>
      ]);
      const [active, setActive] = useState(false);

  const toggleModal = useCallback(() => setActive((active) => !active), []);
  return (
    <div className="offers-page">
         {navigation.state !== "idle" ? <div className="loader-spinner"><Spinner accessibilityLabel="Spinner example" size="large" /></div>: <>
        <div className="top-bar">
            <div className="top-bar-text">
                All Offers
            </div>
            <div className="top-bar-buttons">
            <ButtonGroup>
                <Button>Installation Guide</Button>
                <Button>Uninstall</Button>
            </ButtonGroup>
            </div>
        </div>   
        <Page>
        <div className="offers-page-top">
            <div className="offers-page-text">
                All Offers
            </div>
            <div className="offers-page-buttons">
            <Button onClick={toggleModal} variant='primary'>Create Offer</Button>
            </div>
        </div>
        <div className="offers-page-bottom">
            { sessions.length > 0 ?
        <DataTable
            columnContentTypes={[
                'text',
                'numeric',
                'numeric',
                'numeric',
                'numeric',
                'numeric',
                'numeric',
                'numeric'
            ]}
            headings={[
                'Offer Title',
                'Offer Type',
                'Offer On',
                'Start date',
                'End date',
                'Priority',
                'Status',
                'Channels'
            ]}
            rows={rows}
            pagination={{
                hasNext: false,
                onNext: () => {},
            }}
            /> : 

            <DataTable
            columnContentTypes={[
                'text',
                'numeric',
                'numeric',
                'numeric',
                'numeric',
                'numeric',
                'numeric',
                'numeric'
            ]}
            headings={[
                'Offer Title',
                'Offer Type',
                'Offer On',
                'Start date',
                'End date',
                'Priority',
                'Status',
                'Channels'
            ]}
            rows={[[
            <EmptyState
            heading="Create your first offer"
            action={{content: 'Create Offer', onAction: () => setActive((active) => !active) }}
            image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
        >
            <p>Discount will apply on your store based on this offers.</p>
        </EmptyState>
            ] ]}
            />
        }
        </div>
        </Page>
        <div className="offers-page-modal">
            <Frame>
            <Modal
            instant
            open={active}
            onClose={toggleModal}
            title="Select a Discount Type"
            primaryAction={{
                content: 'Close',
                onAction: toggleModal,
            }}
            >
            <Modal.Section>
            <Card>
                        <ResourceList
                        resourceName={{singular: 'customer', plural: 'customers'}}
                        items={[
                        {
                            id: '100',
                            url: 'bundle',
                            name: 'Bundle Discount',
                            location: 'Encourage customers to buy related items together by offering a discount.',
                            avatarSource: 'https://cdn-icons-png.flaticon.com/512/3639/3639103.png'
                        },
                        {
                            id: '200',
                            url: '#',
                            name: 'Free Gift',
                            location: 'Offer a complimentary item to incentivize larger purchases.',
                             avatarSource: 'https://cdn-icons-png.flaticon.com/512/3656/3656900.png'
                        },
                        {
                            id: '300',
                            url: '#',
                            name: 'Volume/Bulk Discount',
                            location: 'Provide a discount for customers purchasing in bulk to increase order sizes.',
                             avatarSource: 'https://cdn-icons-png.flaticon.com/512/15838/15838518.png'
                        },
                        {
                            id: '400',
                            url: '#',
                            name: 'Wholesale/General Discount',
                            location: 'Offer reduced prices for bulk purchases to attract wholesale buyers.',
                             avatarSource: 'https://cdn-icons-png.flaticon.com/512/8205/8205367.png'
                        },
                        {
                            id: '500',
                            url: '#',
                            name: 'Bogo Discount',
                            location: 'Encourage customers to purchase more items with buy one, get one free deals.',
                             avatarSource: 'https://cdn-icons-png.flaticon.com/512/3876/3876268.png'
                        },
                        {
                            id: '600',
                            url: '#',
                            name: 'Cart Conditional Discount',
                            location: 'Offer a discount based on the total cart value to increase average order value.',
                             avatarSource: 'https://cdn-icons-png.flaticon.com/512/11730/11730264.png'
                        },
                        {
                            id: '700',
                            url: '#',
                            name: 'Post Purchase/ Aftersell',
                            location: 'Provide exclusive offers to customers after they complete their purchase, before the thank you page.',
                            avatarSource: 'https://cdn-icons-png.flaticon.com/512/3910/3910427.png'
                        }
                        ]}
                        renderItem={(item) => {
                        const {id, url, name, location, avatarSource} = item;

                        return (
                            <ResourceItem
                            verticalAlignment="center"
                            id={id}
                            url={url}
                            media={
                                <Avatar customer size="md" name={name} source={avatarSource} />  
                            }
                            accessibilityLabel={`View details for ${name}`}
                            >
                            <Text variant="bodyMd" fontWeight="bold" as="h3">
                                {name}
                            </Text>
                            <div>{location}</div>
                            </ResourceItem>
                        );
                        }}
                    />
            </Card>
            </Modal.Section>
            </Modal>
        </Frame>
        </div>
        </>}
    </div>
  )
}
