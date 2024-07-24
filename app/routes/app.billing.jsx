import React from 'react';
import { useState} from 'react';
import { Page, InlineGrid, Button } from '@shopify/polaris';
import { Form, useSubmit, useActionData } from "@remix-run/react";
import '../styles/style.css';

export default function Billing() {
    const [activePlan, setActivePlan] = useState('Premium Plan');
    const submit = useSubmit();
    const actionData = useActionData();
    console.log(actionData, 'actionData');

    const handlePlanClick = (plan) => {
        setActivePlan(plan);
      };
    
      const handleButtonClick = () => {
        const formData = new FormData();
        formData.append('plan', activePlan);
        submit(formData, { method: 'post', action: '/app/subscription1' });
      };
     
  return (
      <Page>
       <h1 className='heading-plans'>Choose Your Plan</h1> 
      <InlineGrid gap="400" columns={3}>
        <div className={`price-box ${activePlan === 'Basic Plan' ? 'active' : ''}`} onClick={() => handlePlanClick('Basic Plan')}>
            <span></span>
            <h2>Basic plan</h2>
            <p className='price-plan'>$18/month</p>
            <p className='price-trial'>14-day free trial</p>
            <ul>
                <li>Create unlimited product bundles.</li>
                <li>Fixed percentage or amount discount on bundles.</li>
                <li>Track bundle performance with basic metrics.</li>
                <li>Basic customization options for how bundles appear on product pages.</li>
                <li>Access to email customer support.</li>
            </ul>
        </div>
        <div className={`price-box ${activePlan === 'Pro Plan' ? 'active' : ''}`} onClick={() => handlePlanClick('Pro Plan')}>
            <span></span>
            <h2>Pro Plan</h2>
            <p className='price-plan'>$36/month</p>
            <p className='price-trial'>14-day free trial</p>
            <ul>
                <li>Create unlimited product bundles.</li>
                <li>Tiered discounts, BOGO offers, and conditional discounts.</li>
                <li>Sync bundle inventory with individual product inventory.</li>
                <li>Detailed metrics and reports on bundle performance.</li>
                <li>Advanced customization options, including custom CSS.</li>
                <li>Priority Email Support: Faster response times.</li>
            </ul>
        </div>
        <div className={`price-box ${activePlan === 'Premium Plan' ? 'active' : ''}`} onClick={() => handlePlanClick('Premium Plan')}>
            <span></span>
            <h2>Premium Plan</h2>
            <p className='price-plan'>$54/month</p>
            <p className='price-trial'>14-day free trial</p>
            <ul>
                <li>Create unlimited product bundles.</li>
                <li>Tiered discounts, BOGO offers, and conditional discounts.</li>
                <li>Sync bundle inventory with individual product inventory.</li>
                <li>Detailed metrics and reports on bundle performance.</li>
                <li>Advanced customization options, including custom CSS.</li>
                <li>Recommendations for personalized bundles.</li>
                <li>Integrate with major CRM, email marketing, and analytics platforms.</li>
                <li>Personalized support and strategic guidance.</li>
                <li>24/7 Support: Around-the-clock customer support.</li>
            </ul>
        </div>
      </InlineGrid>
      <div className="plan-button">
          <Button variant="primary" size='large' onClick={handleButtonClick}>Select the plan</Button>
      </div>
      </Page>
  )
}
