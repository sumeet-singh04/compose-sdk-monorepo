export const dimensionalModelECommerce = {
  name: 'Sample ECommerce',
  dataSource: 'Sample ECommerce',
  metadata: [
    {
      attributes: [
        {
          expression: '[Brand.Brand]',
          name: 'Brand',
          type: 'text-attribute',
        },
        {
          expression: '[Brand.Brand ID]',
          name: 'Brand ID',
          type: 'numeric-attribute',
        },
      ],
      dimensions: [],
      name: 'Brand',
      type: 'dimension',
    },
    {
      attributes: [
        {
          expression: '[Category.Category]',
          name: 'Category',
          type: 'text-attribute',
        },
        {
          expression: '[Category.Category ID]',
          name: 'Category ID',
          type: 'numeric-attribute',
        },
      ],
      dimensions: [],
      name: 'Category',
      type: 'dimension',
    },
    {
      attributes: [
        {
          expression: '[Commerce.Age Range]',
          name: 'Age Range',
          type: 'text-attribute',
        },
        {
          expression: '[Commerce.Brand ID]',
          name: 'Brand ID',
          type: 'numeric-attribute',
        },
        {
          expression: '[Commerce.Category ID]',
          name: 'Category ID',
          type: 'numeric-attribute',
        },
        {
          expression: '[Commerce.Condition]',
          name: 'Condition',
          type: 'text-attribute',
        },
        {
          expression: '[Commerce.Cost]',
          name: 'Cost',
          type: 'numeric-attribute',
        },
        {
          expression: '[Commerce.Country ID]',
          name: 'Country ID',
          type: 'numeric-attribute',
        },
        {
          expression: '[Commerce.Date (Month)]',
          name: 'Date (Month)',
          type: 'numeric-attribute',
        },
        {
          expression: '[Commerce.Gender]',
          name: 'Gender',
          type: 'text-attribute',
        },
        {
          expression: '[Commerce.Quantity]',
          name: 'Quantity',
          type: 'numeric-attribute',
        },
        {
          expression: '[Commerce.Revenue]',
          name: 'Revenue',
          type: 'numeric-attribute',
        },
        {
          expression: '[Commerce.Visit ID]',
          name: 'Visit ID',
          type: 'numeric-attribute',
        },
      ],
      dimensions: [
        {
          expression: '[Commerce.Date (Calendar)]',
          name: 'Date',
          type: 'datedimension',
        },
      ],
      name: 'Commerce',
      type: 'dimension',
    },
    {
      attributes: [
        {
          expression: '[Country.Country]',
          name: 'Country',
          type: 'text-attribute',
        },
        {
          expression: '[Country.Country ID]',
          name: 'Country ID',
          type: 'numeric-attribute',
        },
      ],
      dimensions: [],
      name: 'Country',
      type: 'dimension',
    },
  ],
};

export const generatedModelECommerce = `import {
  Dimension,
  DateDimension,
  Attribute,
  createAttribute,
  createDateDimension,
  createDimension,
} from '@sisense/sdk-data';

export const DataSource = 'Sample ECommerce';

interface BrandDimension extends Dimension {
  Brand: Attribute;
  BrandID: Attribute;
}
export const Brand = createDimension({
  name: 'Brand',
  Brand: createAttribute({
    name: 'Brand',
    type: 'text-attribute',
    expression: '[Brand.Brand]',
  }),
  BrandID: createAttribute({
    name: 'BrandID',
    type: 'numeric-attribute',
    expression: '[Brand.Brand ID]',
  }),
}) as BrandDimension;

interface CategoryDimension extends Dimension {
  Category: Attribute;
  CategoryID: Attribute;
}
export const Category = createDimension({
  name: 'Category',
  Category: createAttribute({
    name: 'Category',
    type: 'text-attribute',
    expression: '[Category.Category]',
  }),
  CategoryID: createAttribute({
    name: 'CategoryID',
    type: 'numeric-attribute',
    expression: '[Category.Category ID]',
  }),
}) as CategoryDimension;

interface CommerceDimension extends Dimension {
  AgeRange: Attribute;
  BrandID: Attribute;
  CategoryID: Attribute;
  Condition: Attribute;
  Cost: Attribute;
  CountryID: Attribute;
  DateMonth: Attribute;
  Gender: Attribute;
  Quantity: Attribute;
  Revenue: Attribute;
  VisitID: Attribute;
  Date: DateDimension;
}
export const Commerce = createDimension({
  name: 'Commerce',
  AgeRange: createAttribute({
    name: 'AgeRange',
    type: 'text-attribute',
    expression: '[Commerce.Age Range]',
  }),
  BrandID: createAttribute({
    name: 'BrandID',
    type: 'numeric-attribute',
    expression: '[Commerce.Brand ID]',
  }),
  CategoryID: createAttribute({
    name: 'CategoryID',
    type: 'numeric-attribute',
    expression: '[Commerce.Category ID]',
  }),
  Condition: createAttribute({
    name: 'Condition',
    type: 'text-attribute',
    expression: '[Commerce.Condition]',
  }),
  Cost: createAttribute({
    name: 'Cost',
    type: 'numeric-attribute',
    expression: '[Commerce.Cost]',
  }),
  CountryID: createAttribute({
    name: 'CountryID',
    type: 'numeric-attribute',
    expression: '[Commerce.Country ID]',
  }),
  DateMonth: createAttribute({
    name: 'DateMonth',
    type: 'numeric-attribute',
    expression: '[Commerce.Date (Month)]',
  }),
  Gender: createAttribute({
    name: 'Gender',
    type: 'text-attribute',
    expression: '[Commerce.Gender]',
  }),
  Quantity: createAttribute({
    name: 'Quantity',
    type: 'numeric-attribute',
    expression: '[Commerce.Quantity]',
  }),
  Revenue: createAttribute({
    name: 'Revenue',
    type: 'numeric-attribute',
    expression: '[Commerce.Revenue]',
  }),
  VisitID: createAttribute({
    name: 'VisitID',
    type: 'numeric-attribute',
    expression: '[Commerce.Visit ID]',
  }),
  Date: createDateDimension({
    name: 'Date',
    expression: '[Commerce.Date (Calendar)]',
  }),
}) as CommerceDimension;

interface CountryDimension extends Dimension {
  Country: Attribute;
  CountryID: Attribute;
}
export const Country = createDimension({
  name: 'Country',
  Country: createAttribute({
    name: 'Country',
    type: 'text-attribute',
    expression: '[Country.Country]',
  }),
  CountryID: createAttribute({
    name: 'CountryID',
    type: 'numeric-attribute',
    expression: '[Country.Country ID]',
  }),
}) as CountryDimension;
`;
