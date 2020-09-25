import React, { useRef, useEffect } from "react";
import { useFormikContext } from "formik";
import { DATA_TYPE_TO_LABEL_AND_ICON } from "./constants";
import { getSchemaForDataType } from "amplication-data";
import * as models from "../models";
import {
  SelectField,
  Props as SelectFieldProps,
} from "../Components/SelectField";

const DATA_TYPE_OPTIONS = Object.entries(DATA_TYPE_TO_LABEL_AND_ICON)
  .filter(([value, content]) => value !== models.EnumDataType.Id)
  .map(([value, content]) => ({
    value,
    label: content.label,
    icon: content.icon,
  }));

type Props = Omit<SelectFieldProps, "options" | "name">;

const DataTypeSelectField = (props: Props) => {
  const formik = useFormikContext<{
    dataType: models.EnumDataType;
  }>();
  const previousDataTypeValue = useRef<models.EnumDataType>();

  //Reset the properties list and the properties default values when data type is changed
  /**@todo: keep values of previous data type when properties are equal */
  /**@todo: keep values of previous data type to be restored if the previous data type is re-selected */
  useEffect(() => {
    const nextDataTypeValue = formik.values.dataType;
    //do not reset to default on the initial selection of data type
    if (
      previousDataTypeValue.current &&
      previousDataTypeValue.current !== nextDataTypeValue
    ) {
      const schema = getSchemaForDataType(formik.values.dataType);
      const defaultValues = Object.fromEntries(
        Object.entries(schema.properties).map(([name, property]) => [
          name,
          property.default,
        ])
      );

      formik.setFieldValue("properties", defaultValues);
      previousDataTypeValue.current = nextDataTypeValue;
    }
  }, [formik]);

  return <SelectField {...props} name="dataType" options={DATA_TYPE_OPTIONS} />;
};

export default DataTypeSelectField;
