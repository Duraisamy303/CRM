import Funnel from '@/common_component/funnelChart';
import React, { Component } from 'react';

import { FunnelChart } from 'react-funnel-pipeline';
import 'react-funnel-pipeline/dist/index.css';

export default function test() {
    return (
        <Funnel
            height={200}
            width={400}
            data={[
                { name: 'Awareness', value: 252 },
                { name: 'Interest', value: 105 },
                { name: 'Consideration', value: 84 },
                { name: 'Evaluation', value: 72 },
                { name: 'Commitment', value: 19 },
                { name: 'Pre-sale', value: 0 },
                { name: 'Sale', value: 0 },
            ]}
        />
    );
}
