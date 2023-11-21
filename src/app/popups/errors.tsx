"use client";
import Image from "next/image";
import Error from "@/assets/images/error.svg";
import styles from "@/styles/popup.module.scss";

const Errors = (props) => {
    const {  modalTitle, modalDesc, gainLoss, change} = props;
    return(
        <>  
            <Image src={Error} alt="Error" width={34} height={34} />
            <h5 className="mt-3">{modalTitle}</h5>
            {gainLoss == null ? <></> : <>
            <div className={styles.gainloss}>
                    <label>Gain / Loss</label>
                    <strong>{gainLoss}</strong> 
                    <span>{change}</span>
                </div>
            </>
            }
            <p className="mb-4">{modalDesc}</p>
        </>
    )
}
export default Errors;