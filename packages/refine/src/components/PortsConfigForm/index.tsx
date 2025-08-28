import {
  Select,
  TableForm,
  InputInteger,
  TableFormHandle,
  TableFormColumn,
} from '@cloudtower/eagle';
import { ServicePort } from 'kubernetes-types/core/v1';
import isEqual from 'lodash-es/isEqual';
import React, { useEffect, useRef, useState, useMemo, useImperativeHandle } from 'react';
import { useTranslation } from 'react-i18next';
import { validatePort, rfc1123NameValidator } from 'src/utils/validation';

interface PortsConfigFormProps {
  value: ServicePort[];
  serviceType?: string;
  onChange: (value: ServicePort[]) => void;
}

export interface PortsConfigFormHandle {
  validate: () => Promise<boolean>;
}

export const PortsConfigForm = React.forwardRef<
  PortsConfigFormHandle,
  PortsConfigFormProps
>(function PortsConfigForm({ value, serviceType, onChange }: PortsConfigFormProps, ref) {
  const { i18n } = useTranslation();
  const tableFormRef = useRef<TableFormHandle>(null);
  const [_value, _setValue] = useState(value);
  const [forceUpdateCount, setForceUpdateCount] = useState(0);

  const columns = useMemo(() => {
    const columns: TableFormColumn[] = [
      {
        key: 'protocol',
        title: i18n.t('dovetail.protocol'),
        render: ({ value, onChange }) => {
          const options = [
            {
              label: i18n.t('dovetail.tcp'),
              value: 'TCP',
            },
            {
              label: i18n.t('dovetail.udp'),
              value: 'UDP',
            },
          ];
          return (
            <Select
              options={options}
              size="small"
              input={{
                value,
                onChange,
              }}
            />
          );
        },
      },
      {
        key: 'name',
        title: i18n.t('dovetail.port_name'),
        type: 'input',
        validator: ({ value: portName, rowIndex }) => {
          if (!portName) return i18n.t('dovetail.required_field', {
            label: i18n.t('dovetail.port_name'),
          });

          const errorMessage = rfc1123NameValidator({
            v: portName || '',
            allNames: _value.filter((_, index) => index !== rowIndex).map(port => port.name || ''),
            i18n,
          });

          if (errorMessage) return errorMessage;
        },
      },
      {
        key: 'port',
        title: i18n.t('dovetail.port'),
        render: ({ value, onChange }) => {
          return <InputInteger value={value} size="small" onChange={onChange} />;
        },
        validator: ({ value }) => {
          const { isValid, errorMessage } = validatePort(value || '', false, i18n);

          if (!isValid) return errorMessage;
        },
      },
      {
        key: 'targetPort',
        title: i18n.t('dovetail.container_port'),
        render: ({ value, onChange }) => {
          return <InputInteger value={value} size="small" onChange={onChange} />;
        },
        validator: ({ value }) => {
          const { isValid, errorMessage } = validatePort(value || '', false, i18n);
          
          if (!isValid) return errorMessage;
        },
      },
    ];

    if (['NodePort', 'LoadBalancer'].includes(serviceType || '')) {
      columns.push({
        key: 'nodePort',
        title: i18n.t('dovetail.node_port'),
        render: ({ value, onChange }) => {
          return <InputInteger value={value} size="small" onChange={onChange} />;
        },
        validator: ({ value }) => {
          const { isValid, errorMessage } = validatePort(value || '', false, i18n);
          
          if (!isValid) return errorMessage;
        },
      });
    }

    return columns;
  }, [serviceType, i18n]);

  useEffect(() => {
    if (value && !isEqual(value, _value)) {
      _setValue(value);
      tableFormRef.current?.setData(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useImperativeHandle(
    ref,
    () => ({
      validate: () => {
        return new Promise<boolean>(resolve => {
          tableFormRef.current?.validateWholeFields();
          setForceUpdateCount(forceUpdateCount + 1);

          setTimeout(() => {
            const isValid = tableFormRef.current?.isValid();

            resolve(isValid || false);
          }, 0);
        });
      },
    }),
    [forceUpdateCount]
  );

  return (
    <TableForm
      ref={tableFormRef}
      defaultData={value}
      columns={columns}
      onBodyChange={data => {
        _setValue(data as ServicePort[]);
        onChange(data as ServicePort[]);
      }}
      rowAddConfig={{
        addible: true,
        text: () => i18n.t('dovetail.add_port'),
      }}
      row={{
        deletable: _value.length > 1,
      }}
      disableBatchFilling
      hideEmptyTable
    />
  );
});
