プロジェクトのURL
https://script.google.com/u/0/home/projects/1fX8727Zy8j55VeHzbrmZcflM3CNK4UOGMpM5TieYBgG61vUTkvfo2wDS/edit

db作成を参考にしたwebサイト
https://qiita.com/BruceWeyne/items/54cffecf338cc278523c


登録済みコマンド
npm run format # フォーマット自動整形
npm run push # GASに同期、githubにpushを同時に行う


github ssh接続
ssh-keygen -t rsa #キーの作成
cat /home/node/.ssh/id_rsa.pub #公開鍵の表示
ssh -T git@github.com #接続確認

github commit pushの流れ
git add . # ファイル名を指定してもよい
git commit -m ''
git push