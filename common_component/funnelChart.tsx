import React, { Component } from 'react';

import { FunnelChart } from 'react-funnel-pipeline';
import 'react-funnel-pipeline/dist/index.css';

// [
//     { name: 'Awareness', value: 252 },
//     { name: 'Interest', value: 105 },
//     { name: 'Consideration', value: 84 },
//     { name: 'Evaluation', value: 72 },
//     { name: 'Commitment', value: 19 },
//     { name: 'Pre-sale', value: 0 },
//     { name: 'Sale', value: 0 },
// ]

export default function Funnel(props: any) {
    const { data, height, width } = props;
    return <FunnelChart chartWidth={width ? width : 600} chartHeight={height ? height : 300} data={data} />;
}
