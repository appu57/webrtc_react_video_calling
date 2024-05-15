const FormInput = (props) =>{
    const {label, onChange , id , ...inputProps} = props;
    return (
        <div className="formInput">
            <label>{label}</label>
            <input className="inputClass" {...inputProps} onChange={onChange}/>
        </div>
    )
}
export default FormInput;