"use client";
import { Form } from "react-bootstrap";

const EditOrder = () => {
    return(
        <>
            <Form className="row">
                    <div className="col-6">
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Side</Form.Label>
                            <Form.Select aria-label="Default select example">
                                <option>Sell</option>
                                <option value="1">One</option>
                                <option value="2">Two</option>
                                <option value="3">Three</option>
                            </Form.Select>
                        </Form.Group>
                    </div>
                    <div className="col-6">
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                        <Form.Label>Type</Form.Label>
                            <Form.Select aria-label="Default select example">
                                <option>Stop</option>
                                <option value="1">One</option>
                                <option value="2">Two</option>
                                <option value="3">Three</option>
                            </Form.Select>
                        </Form.Group>
                    </div>
                    <div className="col-6">
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Quantity</Form.Label>
                            <Form.Control type="number" placeholder="Qty" />
                        </Form.Group>
                    </div>
                    <div className="col-6">
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Price</Form.Label>
                            <Form.Control type="number" placeholder="Price" />
                        </Form.Group>
                    </div>
                    <div className="col-6">
                        <Form.Group className="mb" controlId="exampleForm.ControlInput1">
                            <Form.Label>Duration</Form.Label>
                            <Form.Control type="number" placeholder="Enter Here" />
                        </Form.Group>
                    </div>
                </Form>
        </>
    )
}
export default EditOrder;