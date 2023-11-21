"use client";
import { useEffect, useState } from 'react';
import styles from "@/styles/strategies.module.scss";
import Image from 'next/image';
import {data} from "@/utils/knowmore";
import { Badge} from "react-bootstrap";
import { index } from 'mathjs';
import React from 'react';


const KnowMore = ({Category, onDataUpdate}) =>{
    const selectedStrategyData =  data.find(
        (strategy) => strategy.name === Category
    );    
    const [selectedCategory, setSelectedCategory] = useState(false);

    const handleUpdateClick = () => {
        onDataUpdate(selectedCategory);
        setSelectedCategory(false)
    };

    return(
        <>
            <section className={styles.knowmore} key={Category}>
                <div className={styles.knowmore_header}>
                    <h3><span className="icon-arrow-outward" onClick={handleUpdateClick}></span>{selectedStrategyData.name}</h3>
                    {selectedStrategyData.categories.map((cat, index) => (
                        <Badge bg={cat.color} key={index}>
                            <span className={cat.icon}></span> {cat.name}
                        </Badge>
                    ))}
                    {selectedStrategyData.labels.map((label, index) => (
                        <Badge bg="info" key={index}>
                            {label}
                        </Badge>
                    ))}
                </div>
                <div className={styles.knowmore_body}>
                    <strong>Preview</strong>
                    <p>{selectedStrategyData.preview}</p>
                    <div className={styles.knwoImage}>
                        <Image width={500} height={250} src={selectedStrategyData.image} alt={selectedStrategyData.name} />
                    </div>
                    <strong>Full Description</strong>
                    {selectedStrategyData.description.map((desc, index) => (
                        <p key={index}>{desc}</p>
                    ))}
                    {selectedStrategyData.alis != '' ? 
                        <div className={styles.alias}>
                            <strong>Alias</strong>
                            <p>{selectedStrategyData.alis}</p>
                        </div> : <></>
                    }
                    {selectedStrategyData.breakevenlist.length >= 1 ? 
                        <div className={styles.breakeven}>
                            <strong>Breakeven</strong>
                            {selectedStrategyData.breakevenlist.map((breakeven, index) => (
                            <p key={index}>{breakeven}</p> 
                            ))}
                        </div>  : <></>
                    }
                    {selectedStrategyData.sweetspotlist.length >= 1 ? 
                        <div className={styles.sweetspot}>
                            <strong>Sweet Spot</strong>
                            {selectedStrategyData.sweetspotlist.map((sweetspot, index) => (
                            <p key={index}>{sweetspot}</p> 
                            ))}
                        </div>  : <></>
                    }
                    {selectedStrategyData.maxprofit != '' ? 
                        <div className={styles.maxprofit}>
                            <strong>Max Profit</strong>
                            <p>{selectedStrategyData.maxprofit}</p>
                        </div> : <></>
                    }
                    {selectedStrategyData.maxlosslist.length >= 1 ? 
                        <div className={styles.maxloss}>
                            <strong>Max Loss</strong>
                            {selectedStrategyData.maxlosslist.map((maxloss, index) => (
                            <p key={index}>{maxloss}</p> 
                            ))}
                        </div>  : <></>
                    }
                </div>
            </section>
        </>

    )
    
    return(
        <></>
    )
}

export default KnowMore;
// function onDataUpdate(selectedCategory: any) {
//     throw new Error('Function not implemented.');
// }

