---
title: ChatConfig
---

# Interface ChatConfig

## Properties

### defaultContextTitle

> **defaultContextTitle**?: `string`

The default context (data model or perspective) title to use for a chat session

If specified, the data topic selector screen will not be shown.

***

### enableFollowupQuestions

> **enableFollowupQuestions**: `boolean`

Boolean flag to show or hide suggested questions following a chat response. Currently
follow-up questions are still under development and are not validated. Therefore, follow-up
questions are disabled by default.

***

### inputPromptText

> **inputPromptText**: `string`

The input prompt text to show in the chat input box

***

### numOfRecommendations

> **numOfRecommendations**: `number`

Number of recommended queries that should be shown in a chat session

If not specified, the default value is `4`

***

### welcomeText

> **welcomeText**?: `string` \| `false`

The welcome text to show at the top of a chat session.

A value of `false` will hide the welcome text.
