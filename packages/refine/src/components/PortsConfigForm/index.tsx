import {
  Select,
  TableForm,
  InputInteger,
  TableFormHandle,
  TableFormColumn,
} from '@cloudtower/eagle';
import { useList } from '@refinedev/core';
import { ServicePort } from 'kubernetes-types/core/v1';
import isEqual from 'lodash-es/isEqual';
import React, { useEffect, useRef, useState, useMemo, useImperativeHandle } from 'react';
import { useTranslation } from 'react-i18next';
import { ServiceModel } from 'src/models/service-model';
import {
  validateNodePort,
  validatePort,
  validateRfc1123Name,
} from 'src/utils/validation';
import { NodePort, NodePortMode } from './NodePort';

export type PortConfigValue = Omit<ServicePort, 'nodePort'> & {
  nodePort: { value: number; mode: NodePortMode };
};

interface PortsConfigFormProps {
  value: PortConfigValue[];
  serviceType?: string;
  serviceId?: string;
  onChange: (value: PortConfigValue[]) => void;
}

export interface PortsConfigFormHandle {
  validate: () => Promise<boolean>;
}

export const PortsConfigForm = React.forwardRef<
  PortsConfigFormHandle,
  PortsConfigFormProps
>(function PortsConfigForm(
  { value, serviceType, serviceId, onChange }: PortsConfigFormProps,
  ref
) {
  const { i18n } = useTranslation();
  const tableFormRef = useRef<TableFormHandle>(null);
  const [_value, _setValue] = useState(value);
  const [forceUpdateCount, setForceUpdateCount] = useState(0);
  const { data: services } = useList<ServiceModel>({
    resource: 'services',
    meta: {
      resourceBasePath: '/api/v1',
      kind: 'Service',
    },
    pagination: {
      mode: 'off',
    },
  });

  const nodePortsFromOtherServices = useMemo(() => {
    return (services?.data
      ?.filter(service => service.id !== serviceId)
      .map(service => service?.spec?.ports?.map(port => port.nodePort))
      .flat()
      .filter(port => port !== undefined) || []) as number[];
  }, [services, serviceId]);
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
        title: `${i18n.t('dovetail.name')} ${i18n.t('dovetail.optional_with_bracket')}`,
        type: 'input',
        validator: ({ value: portName, rowIndex }) => {
          const { errorMessage } = validateRfc1123Name({
            v: portName || '',
            allNames: _value
              .filter((_, index) => index !== rowIndex)
              .map(port => port.name || ''),
            i18n,
            isOptional: true,
          });

          if (errorMessage) return errorMessage;
        },
      },
      {
        key: 'port',
        title: i18n.t('dovetail.service_port'),
        render: ({ value, onChange }) => {
          return (
            <InputInteger
              value={value}
              size="small"
              placeholder="1-65535"
              onChange={onChange}
            />
          );
        },
        validator: ({ value }) => {
          const { isValid, errorMessage } = validatePort(value ?? '', {
            isOptional: false,
            i18n,
            emptyText: i18n.t('dovetail.required_field', {
              label: i18n.t('dovetail.service_port'),
            }),
          });

          if (!isValid) return errorMessage;
        },
      },
      {
        key: 'targetPort',
        title: i18n.t('dovetail.container_port'),
        render: ({ value, onChange }) => {
          return (
            <InputInteger
              value={value}
              size="small"
              placeholder="1-65535"
              onChange={onChange}
            />
          );
        },
        validator: ({ value }) => {
          const { isValid, errorMessage } = validatePort(value ?? '', {
            isOptional: false,
            i18n,
            emptyText: i18n.t('dovetail.required_field', {
              label: i18n.t('dovetail.container_port'),
            }),
          });

          if (!isValid) return errorMessage;
        },
      },
    ];

    if (['NodePort', 'LoadBalancer'].includes(serviceType || '')) {
      columns.push({
        key: 'nodePort',
        width: 200,
        title: i18n.t('dovetail.node_port'),
        render: ({ value, onChange }) => {
          return (
            <NodePort
              value={value.value}
              mode={value.mode}
              onChange={(value, mode) => onChange({ value, mode })}
            />
          );
        },
        validator: ({ value, rowIndex }) => {
          const allNodePorts = [
            ...nodePortsFromOtherServices,
            ..._value
              .filter(
                (row, index) =>
                  index !== rowIndex &&
                  row.nodePort.mode === NodePortMode.Manual &&
                  !!row.nodePort?.value
              )
              .map(row => row.nodePort.value),
          ] as number[];
          const { isValid, errorMessage } =
            value.mode === 'auto'
              ? { isValid: true, errorMessage: undefined }
              : validateNodePort(value.value ?? '', allNodePorts, i18n);

          if (!isValid) return errorMessage;
        },
      });
    }

    return columns;
  }, [serviceType, _value, i18n, nodePortsFromOtherServices]);

  useEffect(() => {
    if (value && !isEqual(value, _value)) {
      _setValue(value);
      tableFormRef.current?.setDataWithoutTriggerChange(value);
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
        const newData = data.map(item => ({
          ...item,
          protocol: item.protocol || 'TCP',
          nodePort: item.nodePort || {
            value: undefined,
            mode: NodePortMode.Auto,
          },
        })) as PortConfigValue[];

        _setValue(newData);
        tableFormRef.current?.setDataWithoutTriggerChange(newData);
        onChange(newData);
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

export { NodePortMode };
