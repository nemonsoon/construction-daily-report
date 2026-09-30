// ページの外（GitHub）へのリンク。節の印は説明書の見出しと合わせる
const REPO = "https://github.com/nemonsoon/construction-daily-report";
const USER_GUIDE = `${REPO}/blob/main/docs/user-guide.md`;

export const LINK = {
	repo: REPO,
	license: `${REPO}/blob/main/LICENSE`,
	development: `${REPO}/blob/main/docs/development.md`,
	usage: `${USER_GUIDE}#使い方`,
	inputFormat: `${USER_GUIDE}#読み込める日報の形`,
	customForm: `${USER_GUIDE}#御社の様式に合わせるとき`,
} as const;
