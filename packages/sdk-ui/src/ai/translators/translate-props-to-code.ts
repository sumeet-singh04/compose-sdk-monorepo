import { JaqlElement } from '@/ai/messages/jaql-element';
import { MetadataItemJaql } from '@sisense/sdk-query-client';
import { capitalizeFirstLetter } from '@/ai/translators/utils';
import { normalizeAttributeName } from '@sisense/sdk-data';

const NEW_LINE = '\n';
const VALUE_UNKNOWN = 'UNKNOWN';

export type MembersFilterJaql = {
  members: string[];
};

export type FromNotEqualFilterJaql = {
  fromNotEqual: number;
};

export type FilterJaql = MembersFilterJaql | FromNotEqualFilterJaql;

const stringifyFormula = (jaql: MetadataItemJaql, indent: number): string => {
  let s = '';
  s += 'measureFactory.customFormula(\n';
  s += ' '.repeat(indent);
  s += `  '${jaql.title}',\n`;
  s += ' '.repeat(indent);
  s += `  '${jaql.formula}',\n`;
  s += ' '.repeat(indent);
  s += `  {\n`;

  Object.entries(jaql.context!).forEach(([key, value]) => {
    const attributeName = normalizeAttributeName(
      value.table || VALUE_UNKNOWN,
      value.column || VALUE_UNKNOWN,
      undefined,
      'DM',
    );
    s += ' '.repeat(indent);
    s += `    '${key.slice(1, -1)}': ${attributeName},\n`;
  });

  s += ' '.repeat(indent);
  s += `  }\n`;
  s += ' '.repeat(indent);
  s += `)`;
  return s;
};

// eslint-disable-next-line complexity
const stringifyDimensionOrMeasure = (jaql: MetadataItemJaql, indent: number): string => {
  const { level, table, column, agg, title } = jaql;
  let attributeName;

  if (agg && table && column && title) {
    attributeName = normalizeAttributeName(table, column, undefined, 'DM');
    return `${' '.repeat(indent)}measureFactory.${agg}(${attributeName}, '${title}')`;
  }

  if (table && column) {
    const dateLevel = level ? capitalizeFirstLetter(level) : undefined;
    attributeName = normalizeAttributeName(table, column, dateLevel, 'DM');
    return `${' '.repeat(indent)}${attributeName}`;
  }

  return VALUE_UNKNOWN;
};

const stringifyJaqlElement = (jaqlElement: JaqlElement, indent: number): string => {
  const jaql = jaqlElement.jaql().jaql;

  if ('formula' in jaql) {
    return stringifyFormula(jaql, indent);
  } else {
    return NEW_LINE + stringifyDimensionOrMeasure(jaql, indent);
  }
};

// eslint-disable-next-line sonarjs/cognitive-complexity
export const stringifyProps = (
  props: object | string,
  indent = 0,
  wrapInQuotes = false,
  // eslint-disable-next-line sonarjs/cognitive-complexity
): string => {
  if (!props) {
    return '';
  }

  if (typeof props === 'string') {
    return `'${props}'`;
  }

  if (props instanceof JaqlElement) {
    return stringifyJaqlElement(props, indent);
  }

  let s = '';

  if (Array.isArray(props)) {
    s += `[${props.map((v) => stringifyProps(v, indent + 2))}${
      props.length ? '\n' + ' '.repeat(indent + 2) : ''
    }]`;
  } else {
    s += `{${NEW_LINE}`;
    Object.entries(props).forEach(([key, value]) => {
      if (wrapInQuotes) {
        key = `'${key}'`;
      }
      s += ' '.repeat(indent + 2);
      if (Array.isArray(value)) {
        s += `${key}: [${value.map((v) => stringifyProps(v, indent + 4, wrapInQuotes))}${
          value.length ? '\n' + ' '.repeat(indent + 2) : ''
        }]`;
      } else if (typeof value === 'object') {
        s += `${key}: ${stringifyProps(value, indent + 2, wrapInQuotes)}`;
      } else if (['number', 'boolean', 'undefined', null].includes(typeof value)) {
        s += `${key}: ${value}`;
      } else {
        s += `${key}: '${value}'`;
      }
      s += `,${NEW_LINE}`;
    });
    s += ' '.repeat(indent);
    s += '}';
  }

  return s;
};
