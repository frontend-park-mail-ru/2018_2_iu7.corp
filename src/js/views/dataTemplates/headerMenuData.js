export function authMenuHeader (id) {
	return [
		{
			label: 'Профиль',
			href: `/profile/${id}`
		},
		{
			label: 'Таблица лидеров',
			href: '/leaderboard'
		},
		{
			label: 'Выйти',
			href: '/signout'
		}
	];
}

export function notAuthMenuHeader () {
	return [
		{
			label: 'Вход',
			href: '/signin'
		},
		{
			label: 'Регистрация',
			href: '/signup'
		},
		{
			label: 'Таблица лидеров',
			href: '/leaderboard'
		}
	];
}
