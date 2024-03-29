export const errorCodes = {
	NOT_IN_VOICE: 'NOT_IN_VOICE',
	NO_CHANNEL_DEFINED: 'NO_CHANNEL_DEFINED',
	INCORRECT_CHANNEL_TYPE: 'INCORRECT_CHANNEL_TYPE',
	BAD_URL: 'BAD_URL',
	WHAT_THE_HELL: 'WHAT_THE_HELL'
};

export const errorMessage = {
	[errorCodes.NOT_IN_VOICE]: 'Não estás no voice maninho',
	[errorCodes.NO_CHANNEL_DEFINED]: 'Não há canal definido (settings)',
	[errorCodes.INCORRECT_CHANNEL_TYPE]: 'Tipo incorreto de canal (settings)',
	[errorCodes.BAD_URL]: 'Url lixo!',
	[errorCodes.WHAT_THE_HELL]: 'Algo não devia ter acontecido!'
};
