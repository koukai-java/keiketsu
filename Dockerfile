# フェーズ1: ビルド
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build

# 作業ディレクトリの設定
WORKDIR /app

# Mavenの依存関係をキャッシュするためにpom.xmlをコピー
COPY pom.xml .

# 依存関係をダウンロード（変更がない限りキャッシュが使用される）
RUN mvn dependency:go-offline

# プロジェクトのソースコードをコピー
COPY src ./src

# アプリケーションをビルド
# ここでWARファイルが生成されることを想定
RUN mvn package -DskipTests

# フェーズ2: 実行
# Jakarta EEに対応したTomcatをベースイメージとする
FROM tomcat:11.0.7-jdk21-temurin-noble

# 作成者情報のラベル
LABEL maintainer="m.saito.activity@gmail.com"

# アプリケーションのWARファイルをTomcatのwebappsディレクトリにコピー
# ビルドフェーズで生成されたWARファイルのパスを確認してください
# 通常は target/your-artifact-id.war となります
COPY --from=build /app/target/acupoints-0.0.1-SNAPSHOT.war /usr/local/tomcat/webapps/acupoints.war

# Tomcatがリッスンするポートを公開
# Renderではこのポートを公開する必要があります
EXPOSE 8080

# Tomcatを起動
# catalina.sh run はフォアグラウンドでTomcatを起動し、Dockerコンテナが終了しないようにします
CMD ["catalina.sh", "run"]
