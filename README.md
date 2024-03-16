Burada bir kullanıcının bir veritabanı uygulamasına (DB-APP) istek göndererek ve RabbitMQ default-queue üzerinden iki farklı NodeJS uygulaması 
(provider-app ve client-app) aracılığıyla veri almayı nasıl tetiklediğini gösterir.Bu proje buna hizmet etmektedir.
- user: İstek gönderen kişi.
- Client-app: PostgreSQL veritabanında CRUD işlemleri gerçekleştiren uygulama.
- Provider-app: Veriyi işleyen ve RabbitMQ üzerinden iletişim kuran uygulama.
- RabbitMQ default-queue: İletişim için kullanılan kuyruk.
- DB-APP: Veritabanından veri çeken uygulama.
- Container: Tüm bu bileşenleri içeren bir container ve burada Docker kullanıldı. 
Bu üç uygulama, Docker kullanılarak konteynerize edildi ve Docker Compose kullanılarak bir araya getirilerek birlikte çalıştırıldı. 
Docker Compose dosyası, her uygulama için Docker images oluşturdu ve bu konteynerlerin birbirleriyle iletişim kurmasını sağladı.
Her uygulama kendi Dockerfile'ına sahiptir.





