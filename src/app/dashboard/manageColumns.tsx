import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import styles from "@/styles/dashboard.module.scss";

function DropdownWithCheckboxes(props) {
    const { handleColumnChange, selectedColumns } = props;
    const items = [
        { key: 'mkt_value', value: 'Mkt Value' },
        { key: 'days_left', value: 'Days Left' },
        { key: 'today_gain_loss', value: 'Today Gain/Loss' },
        { key: 'total_gain_loss', value: 'Total Gain/Loss' },
        { key: 'roi', value: 'ROI' },
        { key: 'exit_value', value: 'Ext Value' },
        { key: 'position_delta', value: 'Position Delta' },
        { key: 'cost_basis', value: 'Cost Basis' },
        { key: 'div_date', value: 'Div Date' },
        { key: 'earnings_date', value: 'Earning Date' },
        { key: 'theta', value: 'Theta' },
    ];

    const handleCheckboxChange = (item) => {
        if (selectedColumns.includes(item)) {
            handleColumnChange(selectedColumns.filter((selectedItem) => selectedItem !== item));
        } else {
            handleColumnChange([...selectedColumns, item]);
        }
    };
    return (
        <Dropdown className="positionDropdown">
            <Dropdown.Toggle variant="outline-primary" id="dropdown-basic">
                <span className="icon-columns"></span> Columns
            </Dropdown.Toggle>

            <Dropdown.Menu>
                {items.map((item) => (
                    <Form.Check
                        key={item.key}
                        type="checkbox"
                        label={item.value}
                        id={`checkbox-${item.key}`}
                        checked={selectedColumns.includes(item.key)}
                        onChange={() => handleCheckboxChange(item.key)}
                    />
                ))}
            </Dropdown.Menu>
        </Dropdown >
    );
}

export default DropdownWithCheckboxes;
