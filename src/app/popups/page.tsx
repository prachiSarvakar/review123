"use client";
import React, { useState } from 'react';
import styles from "@/styles/popup.module.scss";
import { Button, Form, Modal } from "react-bootstrap";



const Popups = (props) =>{

    const { show, handleClose, handleSubmit, size, modalTitle, className, submit } = props;

    return(
        <>
            <Modal show={show} onHide={handleClose} centered size={size} aria-labelledby="contained-modal-title-vcenter">
                {modalTitle == '' ? 
                <></> : <>
                    <Modal.Header closeButton>
                        <Modal.Title>{modalTitle}</Modal.Title>
                    </Modal.Header>
                </>   
            }
                <Modal.Body className={className}>
                    {props.children}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-primary" onClick={handleClose}>
                        <span className="icon-close"></span> Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        <span className="icon-done"></span> {submit}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default Popups;