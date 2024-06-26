---
title: Attribute
---

# Interface Attribute

Common interface of an attribute as in a dimensional model.

An attribute is an extension of a [Column](interface.Column.md) in a generic [data set](interface.Data.md).

## Methods

### getSort

> **getSort**(): [`Sort`](../enumerations/enumeration.Sort.md)

Gets the sort definition.

#### Returns

[`Sort`](../enumerations/enumeration.Sort.md)

The Sort definition

***

### sort

> **sort**(`sort`): [`Attribute`](interface.Attribute.md)

Sorts the attribute by the given definition

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `sort` | [`Sort`](../enumerations/enumeration.Sort.md) | Sort definition |

#### Returns

[`Attribute`](interface.Attribute.md)

An sorted instance of the attribute

## Properties

### expression

> **`readonly`** **expression**: `string`

Expression representing the element in a [JAQL query](https://sisense.dev/guides/querying/useJaql/).
It is typically populated automatically in the data model generated by the data model generator.

***

### name

> **name**: `string`

Element name

***

### type

> **`readonly`** **type**: `string`

Element type
