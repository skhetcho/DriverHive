/*!

* Coded by DriverHive

*/

import React from 'react';
import PropTypes from 'prop-types';
import './TextInput.css';


const TextInput = React.forwardRef((props, ref) => {
    const [focussed, setFocussed] = React.useState((props.locked && props.focussed) || false);
    const [locked, setLocked] = React.useState(false);
    const [value, setValue] = React.useState(props.value || '');
    const [error, setError] = React.useState(props.error || '');
    const [fieldType, setFieldType] = React.useState(props.fieldType || 'name');
    const [mandatoryUserName, setMandatoryUserName] = React.useState(false);
    const [label, setLabel] = React.useState(props.label || '');
    const clearInput = () => {
        setValue('')
        setError('')
    };
    React.useImperativeHandle(ref, () => {
        return {
            clearInput: clearInput
        }
    });

    const onBlurEmail = () => {
        setFocussed(false) 
        if (value.length !== 0) {
            const regEmail = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/; //or any other regexp
            if (regEmail.test(value) === false) {
                setError("Please enter a valid email address");
            }
        }

    }
    const onBlurPhone = () => {
        setFocussed(false) 
        if (value.length !== 0) {
            const regPhone = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im; //or any other regexp;
            if (regPhone.test(value) === false) {
                setError("Please enter a correct phone number");
            }
        }
    }
    const onBlurUserName = () => {
        setFocussed(false) 
        if (value.length !== 0) {
            const regPhone = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im; //or any other regexp;
            if (regPhone.test(value) === false) {
                setError("Please enter a correct phone number");
            }
        }
    }
    const onChange = (event, id) => {
        event.persist();
        setValue(event.target.value)
        setError('');
    }

    const fieldClassName = `field ${(props.locked ? focussed : focussed || value) && 'focussed'} ${props.locked && !focussed && 'locked'}`;
    return (
        <div className={fieldClassName}>
            <input
                id={props.id}
                type={fieldType === "password" ? "password" : "text"}
                value={value}
                placeholder={label}
                onChange={(e) => onChange(e, props.id)}
                onKeyPress={props.onKeyPress}
                onFocus={() => !props.locked && setFocussed(true)}
                onBlur={() => !props.locked && fieldType === "email" ? onBlurEmail() : fieldType === "phone" ? onBlurPhone() : setFocussed(false)}
            />
            <label htmlFor={props.id} className={error && 'error'}>
                {error || label}
            </label>
        </div>
    )

});
TextInput.PropTypes = {
    id: PropTypes.string.isRequired,
    locked: PropTypes.bool,
    focussed: PropTypes.bool,
    value: PropTypes.string,
    error: PropTypes.string,
    fieldType: PropTypes.string,
    mandatoryUserName: PropTypes.bool,
    label: PropTypes.string,
    onChange: PropTypes.func,
}
export default (TextInput)