const messages = {
  tr: {
    translations: {
      signup: {
        title: "Kayıt Ol",
        toasts: {
          success: "Kullanıcı başarılı bir şekilde oluşturuldu. Giriş Yapın!",
          fail: "Kullanıcı oluştururken hata oluştu."
        },
        form: {
          name: "Adınız",
          companyName: "Organizasyon Adı",
          email: "Eposta",
          phone: "Telefon",
          password: "Şifre"
        },
        buttons: {
          submit: "Kayıt",
          login: "Hesabınız var mı? Giriş Yapın."
        },
        recaptcha1: "This site is protected by reCAPTCHA and the Google",
        recaptcha2: "Privacy Policy",
        recaptcha3: "and",
        recaptcha4: "Terms of Service",
        recaptcha5: "apply."
      },
      passwordRecovery: {
        title: "Şifremi Unuttum",
        toasts: {
          success: "Eposta gönderildi, eposta adresinizi kontrol edin.",
          passwordUpdateSuccess: "Şifre Başarılı bir şekilde değiştirildi.",
          fail: "Şifre değiştirilirken hata oluştu. Tekrar deneyin."
        },
        form: {
          email: "Eposta",
          password: "Şifre",
          confirmPassword: "Şifre Tekrar",
          validation: "Şifrelerin eşleşmesi gerekiyor!"
        },
        buttons: {
          submit: "Gönder",
          login: "Giriş Yap"
        }
      },
      login: {
        title: "Giriş",
        form: {
          email: "Eposta",
          password: "Şifre"
        },
        buttons: {
          submit: "Gönder",
          register: "Hesabınız yok mu? Kayıt Ol!",
          recovery: "Şifremi Unuttum?"
        }
      },
      auth: {
        toasts: {
          success: "Giriş Başarılı!",
          active:
            "Hesap başarılı bir şekilde aktif edildi. Lütfen giriş yapın.",
          trialExpired: "Deneme süreniz bitti, bizimle iletişime geçiniz.",
          notActive:
            "Hesabınız aktif edilmedi, Lütfen eposta adresinizi doğrulayın."
        }
      },
      dashboard: {
        charts: {
          perHour: {
            title: "Bugün - Sohbet Adeti: ",
            verticalTitle: "Sohbet"
          }
        }
      },
      connections: {
        title: "Bağlantı",
        toasts: {
          deleted: "WhatsApp bağlantısı başarılı bir şekilde silindi!"
        },
        confirmationModal: {
          deleteTitle: "Sil",
          deleteMessage:
            "Silmek istediğinize emin misiniz? Bu işlem geri döndürülemez.",
          disconnectTitle: "Bağlantı Yok!",
          disconnectMessage:
            "Emin misiniz? QR Kodu yeniden okutmanız gerekecek."
        },
        buttons: {
          add: "WhatsApp Ekle",
          disconnect: "Bağlantıyı Sonlandır",
          tryAgain: "Tekrar Deneyin",
          qrcode: "QR Kodu",
          newQr: "Yeni QR Kodu",
          connecting: "Bağlantıyı Oluştur",
          start: "Başla"
        },
        toolTips: {
          disconnected: {
            title: "WhatsApp oturumu başlatılamadı!",
            content:
              "Telefonun İnternet bağlantısı ve şarj seviyesinin düşük olmadığından emin olunuz. Ya da QR Kodu yeniden oluşturunuz."
          },
          qrcode: {
            title: "QR Kodu okumasını bekleyiniz.",
            content:
              "'QR Kodu' butonuna tıklayın ve telefonunuzdan QR Kodu okutarak oturumu başlatın."
          },
          connected: {
            title: "Bağlantı Kuruldu."
          },
          timeout: {
            title: "Telefonunuzla olan bağlantı koptu!",
            content:
              "Telefonun İnternet bağlantısından, WhatsApp'ın arka planda da çalışır olduğundan ve şarj seviyesinin düşük olmadığından emin olunuz. Ya da QR Kodu yeniden oluşturunuz."
          },
          offline: {
            title: "Bağlantı kapalı",
            content: "Online olmak için başlayın."
          }
        },
        table: {
          name: "İsim",
          number: "Numara",
          status: "Durum",
          provider: "WhatsApp",
          default: "Varsayılan",
          actions: "İşlem",
          session: "Oturum"
        }
      },
      whatsappModal: {
        title: {
          add: "WhatsApp Ekle",
          edit: "WhatsApp'ı düzenle"
        },
        form: {
          name: "İsim",
          onNewMessage: "Yeni Bir Mesajda",
          greetingMessage: "Karşılama Mesajı",
          farewellMessage: "Kapanış Mesajı",
          alwaysReopen: "Her zaman önceki konuşmayı yeniden aç",
          customReopen1: "Önceki konuşmayı",
          customReopen2: "dakikaya kadar yeniden aç",
          farewellTooltip: {
            title: "Sohbet Kapatıldıktan sonra gönderilecek mesaj",
            content:
              "Eklemek için aşağıdaki değişkenlere tıklayabilirsiniz. Göndermemek için boş bırakın"
          }
        },
        buttons: {
          okAdd: "Ekle",
          okEdit: "Kaydet",
          cancel: "İptal"
        },
        success: "WhatsApp başarılı bir şekilde kaydedildi."
      },
      qrCode: {
        message: "Oturumu başlatmak için QR Kodu okuyun."
      },
      fastResponses: {
        title: "Hızlı Yanıtlar",
        toasts: {
          deleted: "Hızlı yanıt başarılı bir şekilde silindi!"
        },
        confirmationModal: {
          deleteTitle: "Sil",
          deleteMessage: "Emin misiniz? Bu işlem geri döndürülemez."
        },
        buttons: {
          add: "Hızlı yanıt etkle"
        },
        table: {
          shortcut: "Kısayol",
          message: "Mesaj",
          actions: "Eylem"
        }
      },
      fastResponseModal: {
        title: {
          add: "Hızlı yanıt ekle",
          edit: "Hızlı yanıt düzenle"
        },
        form: {
          shortcut: "Kısayol",
          message: "Mesaj"
        },
        buttons: {
          okAdd: "Ekle",
          okEdit: "Kaydet",
          cancel: "İptal"
        },
        success: "Hızlı yanıt başarılı bir şekilde kaydedildi."
      },
      help: {
        title: "Yardım Merkezi"
      },
      contacts: {
        title: "Kişiler",
        toasts: {
          deleted: "Kişi Başarılı bir şekilde silindi!",
          not_imported_beta:
            "WhatsApp Beta'da kişileri içe aktarmak mümkün değil"
        },
        searchPlaceholder: "Ara ...",
        confirmationModal: {
          deleteTitle: "Sil",
          importTitlte: "Kişileri Yükle",
          deleteMessage:
            "Kişiyi silmek istediğinize emin misiniz? İlgili kişiye ait tüm sohbetler silinecektir.",
          importMessage:
            "Tüm Kişileri telefonunuzdan yüklemek istediğinize emin misiniz?"
        },
        newTicketModal: {
          title: "Yeni Konuşma",
          message: "Sohbete Başlamak için bağlantı oluştur."
        },
        buttons: {
          import: "Kişileri Çek",
          add: "Kişi Ekle"
        },
        table: {
          name: "İsim",
          whatsapp: "WhatsApp",
          email: "Eposta",
          actions: "İşlemler"
        }
      },
      contactModal: {
        title: {
          add: "Kişi Ekle",
          edit: "Kişi Düzenle"
        },
        form: {
          mainInfo: "İletişim Bilgileri",
          extraInfo: "Ek Bilgiler",
          name: "İsim",
          number: "Whatsapp numarası",
          email: "Eposta",
          extraName: "Alan Adı",
          extraValue: "Değeri",
          treatmentName: "İletişim Nedeni",
          verified: "Onaylı",
          notVerified: "Onaylı Değiş"
        },
        buttons: {
          addExtraInfo: "Ekstra Bilgi Ekle ",
          okAdd: "Ekle",
          okEdit: "Kaydet",
          cancel: "İptal"
        },
        success: "Kişi Başarılı bir şekilde kaydedildi."
      },
      queueModal: {
        title: {
          add: "Kuyruk Oluştur",
          edit: "Kuyruk Düzenle"
        },
        form: {
          options: "Ayarlar",
          option: "Ayar",
          name: "İsim",
          color: "Renk",
          greetingMessage: "Karşılama Mesajı",
          responseMessage: "Yanıt:"
        },
        optionsTooltip: {
          title: "ChatBot için ayarları ekle",
          content:
            "Tek bir seçenek varsa, otomatik olarak seçilecek ve botun seçenek mesajıyla yanıt vermesini sağlayacak."
        },
        greetingTooltip: {
          title:
            "Mesaj zorunlu alan, düzenlemek için tıkla! Message is required, click here to edit!",
          content: "Mesajsız bir seçenek seçilmeyecek."
        },
        buttons: {
          okAdd: "Ekle",
          okEdit: "Kaydet",
          cancel: "İptal",
          addOption: "Seçenek Ekle"
        },
        confirmationModal: {
          deleteTitle: "Seçeneği sil",
          deleteMessage: "Emin misiniz? Yapılan tüm seçenekler silinecek!"
        }
      },
      campaignModal: {
        title: {
          add: "Yeni Kampanya"
        },
        form: {
          name: "Kampanya Adı",
          connection: "Bağlantı",
          globalBody: "Varsayılan Mesaj",
          globalBodyTooltip:
            "Bu mesaj, tanımlanmış bir body'si olmayan CSV'deki içe aktarılan numaralara gönderilecektir."
        },
        buttons: {
          okAdd: "Ekle",
          okEdit: "Kaydet",
          cancel: "İptal"
        },
        success: "Kampanya Başarılı şekilde eklendi."
      },
      campaignProgressModal: {
        title: "Kampanya Mesajı",
        name: "Kampanya Adı",
        status: "Durum",
        table: {
          number: "Numara",
          message: "Mesaj",
          updatedAt: "Güncellendi",
          status: "Durum"
        },
        buttons: {
          back: "Geri"
        },
        ackLabels: {
          scheduled: "Ayarlandı",
          pending: "Gönderilmedi",
          sent: "Gönderildi",
          received: "Alındı",
          read: "Okundu"
        }
      },
      csvHandler: {
        downloadCsv: "Örnek Dosyayı İndir",
        importCsv: "CSV Dosyası Yükle"
      },
      userModal: {
        title: {
          add: "Kullanıcı Ekle",
          edit: "Kullanıcı Düzenle"
        },
        form: {
          name: "Ad",
          email: "Eposta",
          password: "Şifre",
          profile: "Profil"
        },
        buttons: {
          okAdd: "Ekle",
          okEdit: "Kaydet",
          cancel: "İptal"
        },
        success: "Kullanıcı başarılı bir şekilde kaydedildi."
      },
      chat: {
        noTicketMessage:
          "Sohbete Başlamak için, herhangi bir sohbet kabul edin veya başlatın."
      },
      ticketsManager: {
        buttons: {
          newTicket: "Yeni"
        }
      },
      multipleSelectField: {
        selectAll: "Tümünü seç"
      },
      ticketsFilter: {
        applyFilters: "Uygula",
        cleanFilters: "Temizle",
        found: "Bulundu",
        placeholders: {
          search: "İsime veya numaraya göre ara",
          queues: "Kuyruklar",
          noQueue: "Sıra",
          whatsapps: "WhatsApp'lar",
          noWhatsapp: "Ne whatsapp",
          users: "Kullanıcılar",
          noUser: "Cevapsız",
          status: "Durumlar",
          protocol: "Protokol",
          tags: "Etiketler",
          dateFrom: "Başlangıç",
          dateTo: "Bitiş",
          pending: "Beklemek",
          open: "Katılmak",
          closed: "Çözüldü"
        }
      },
      ticketTagManager: {
        addTags: "Etiket Ekle",
        add: "Ekle",
        typeToAdd: "Yeni Etiket Yaz",
        confirmationModal: {
          deleteTitle: "Etiket Sil",
          deleteMessage:
            "Emin misiniz? Bu etiket ilgili tüm konuşmalardan silinecek!"
        }
      },
      referral: {
        title: "Referans Programı",
        link: "Referans Bağlantısı"
      },
      subscription: {
        title: "Abonelik",
        details: "Abonelik Detayları",
        billingEmail: "Fatura Eposta",
        unverifiedEmail1: "Bu eposta onaylanmamış, ",
        unverifiedEmailClick: "Buraya Tıkla ",
        unverifiedEmail2: "Aktivasyon mailini yeniden almak için.",
        status: {
          trial: "Deneme",
          active: "Aylık Abone",
          suspended: "Aboneliğin süresi doldu!"
        },
        expirationMessage: {
          trialExpiringIn: "Deneme sürenizin bitmesine {{count}} gün kaldı!!",
          trialExpiringIn_plural:
            "Deneme süreniz {{count}} gün içinde sona eriyor!",
          trialExpired:
            "Deneme süresi doldu, Kullanmak için aboneliğinizi yenileyin!",
          subscriptionCycleExpiring: "Mevcut aboneliğiniz sona eriyor."
        },
        planTable: {
          header: {
            plan: "Plan",
            users: "Kullanıcılar",
            whatsapps: "Whatsapplar",
            total: "Toplam",
            lastInvoice: "Son Fatura"
          },
          planName: "Özel"
        },
        buttons: {
          subscribe: "Abone Ol!",
          edit: "Değiştir",
          close: "Sonlandır"
        },
        tooltip: {
          billingCycle: {
            title: "Bir sonraki faturanızın son ödeme tarihi",
            content:
              "Fatura son ödeme tarihinden 10 gün önce düzenlenir. Aşağıdaki 'Son fatura' düğmesi aracılığıyla veya fatura e-postanız aracılığıyla faturaya erişin."
          }
        }
      },
      changeEmailModal: {
        title: "Fatura epostasını değiştirin",
        placeholder: "Yeni eposta",
        toast: "Yeni bir onay maili eposta adresinize gönderildi.",
        buttons: {
          ok: "Değiştir",
          cancel: "İptal"
        }
      },
      checkoutStepper: {
        titleEdit: "Planı Değiştir",
        titlePending: "Neredeyse Hazır!",
        titleDone: "Aboneliğiniz için Teşekkürler!",
        steps: {
          billingData: "Veri",
          customize: "Özelleştir",
          review: "Gözden Geçir",
          success: "Tebrikler!"
        },
        messages: {
          toastMinimumPlan: "En az 3 kullanıcı ve 1 whatsapp numarası gerekli",
          fieldMinimumUsers: "En Az 3!",
          fieldMinimumWhats: "En az 1!",
          emailSent:
            "Fatura adresine ödeme talimatı içeren bir e-posta gönderildi.",
          activationInfo:
            "Kredi kartı ödemeleri anında etkinleştirilir. Daha fazla yardıma ihtiyacınız olursa bizimle iletişime geçmekten çekinmeyin.",
          planChanged: "Aboneliğiniz güncellendi!",
          planChangedInfo:
            "Yeni kullanıcılar ve whatsapp limiti zaten mevcut. Yeni değer, bir sonraki açık faturanızda tahsil edilecektir."
        },
        buttons: {
          payNow: "Öde!",
          close: "Kapat"
        }
      },
      billingData: {
        title: "Gerekli Bilgiler",
        form: {
          name: "İsim",
          document: "Döküman Numarası",
          zip: "Posta Kodu",
          street: "Sokak",
          number: "Numara",
          district: "İlçe",
          complement: "Adres",
          city: "İl",
          state: "Ülke"
        }
      },
      planBuilder: {
        title: "Aboneliğinizi özelleştirin",
        table: {
          header: {
            item: "Ürün",
            quantity: "Miktar",
            unitaryValue: "Değer",
            subtotal: "Ara Toplam"
          },
          users: "Kullanıcılar",
          whatsapps: "Whatsapp'lar",
          total: "Toplam"
        },
        buttons: {
          next: "Sıradaki"
        }
      },
      subscriptionReview: {
        title: "Abonelik Özeti",
        titleChange: "Uyarı! Değişiklik 30 gün içerisinde değiştirilemez!",
        whatsExceeded:
          "Dikkat! Şu anda kullandığınızdan daha az whatsapp'a ayarlıyorsunuz. Fazla bağlantılar silinecek.",
        planDetails: "Plan Detayları",
        paymentDetails: "Ödeme Bilgisi",
        email: "Eposta",
        users: "Kullanıcılar",
        whatsapps: "Whatsapplar",
        name: "İsim",
        address: "Adres",
        document: "Döküman",
        total: "Toplam",
        buttons: {
          subscribe: "Abone Ol ",
          change: "Değişikliği Onayla",
          back: "Geri"
        }
      },
      tickets: {
        toasts: {
          deleted: "Oluşturulan sohbet silindi."
        },
        notification: {
          message: "Gelen Mesaj"
        },
        tabs: {
          open: { title: "Açık" },
          closed: { title: "Kapalı" },
          search: { title: "Ara" }
        },
        buttons: {
          showAll: "Tüm"
        }
      },
      transferTicketModal: {
        title: "Sohbeti Transfer Et",
        fieldLabel: "Kullanıcı Ara",
        noOptions: "Bu isimde Kullanıcı Bulunamadı.",
        noteLabel: "Gözlemler",
        buttons: {
          ok: "Transfer",
          cancel: "İptal"
        }
      },
      ticketsList: {
        pendingHeader: "Kuyruktakiler",
        assignedHeader: "İlgilenilenler",
        noTicketsTitle: "Boş!",
        noTicketsMessage: "Aranan terimle alakalı hiçbir şey bulunamadı.",
        buttons: {
          accept: "Kabul Et"
        },
        confirmationModal: {
          title: "Otomatik Yanıtlama",
          message:
            "Bu konuşma otomatik yanıtlamada. Kabul etmek, otomatik yanıtlamanın kesilmesine neden olur."
        },
        status: {
          closed: "Kapandı"
        }
      },
      ticketListItem: {
        assignedTo: "İlgilenen",
        waitingWarning: "5 dakikadan fazla bekliyor!",
        noQueue: "sıra yok",
        connectionTooltip: {
          title: "Bir bağlantı seçmek için tıklayın"
        },
        chatbotTooltip: {
          title: "Otomatik Yanıtlama"
        },
        selectWhatsModal: {
          title: "Bu görüşmenin bağlantısı yok",
          message: "Sohbete devam etmek için bir bağlantı seçin",
          applyToAll: "Bağlantı olmadan herkese uygula"
        }
      },
      newTicketModal: {
        title: "Sohbet Oluştur",
        fieldLabel: "Kişileri Ara",
        queues: "Kuyruklar",
        noQueue: "Boş",
        add: "Ekle",
        buttons: {
          ok: "Başla",
          cancel: "İptal"
        }
      },
      whatsappSelect: {
        label: "Bağlantı Seç*"
      },
      mainDrawer: {
        listItems: {
          dashboard: "Pano",
          connections: "Bağlantılar",
          tickets: "Sohbetler",
          contacts: "Kişiler",
          help: "Yardım",
          fastResponses: "Hızlı Yanıtlamalar",
          queues: "Kuyruklar & Chatbotlar",
          administration: "Yönetim",
          users: "Kullanıcılar",
          api: "API",
          apiKeys: "Tokens",
          apiDocs: "Dökümanlar",
          subscription: "Abonelik",
          campaigns: "Kampanyalar",
          referral: "Referans",
          settings: "Ayarlar"
        },
        appBar: {
          user: {
            profile: "Profil",
            logout: "Çıkış"
          }
        }
      },
      notifications: {
        noTickets: "Bildirim Yok."
      },
      queues: {
        title: "Kuyruklar",
        deleteQueue: "Sıra başarıyla silindi.",
        saveQueue: "Sıra başarıyla kaydedildi!",
        table: {
          name: "İsim",
          color: "Renk",
          greeting: "Karşılama mesajı",
          actions: "İşlemler"
        },
        buttons: {
          add: "Kuyruk Ekle"
        },
        confirmationModal: {
          deleteTitle: "Sil",
          deleteMessage:
            "Silmek istediğinize emin misiniz? Bu kuyruktaki sohbetler hala var olacak, ancak atanmışlar herhangi bir sıraya sahip olmayacak!"
        }
      },
      queueSelect: {
        inputLabel: "Kuyruklar"
      },
      users: {
        title: "Kullanıcılar",
        table: {
          name: "İsim",
          email: "Eposta",
          profile: "Profil",
          actions: "İşlemler",
          no_data: "Veri yok"
        },
        buttons: {
          add: "Kullanıcı Ekle"
        },
        toasts: {
          deleted: "Kullanıcı Başarılı bir şekilde silindi."
        },
        confirmationModal: {
          deleteTitle: "Sil",
          deleteMessage:
            "Tüm kullanıcı verileri silinecek. Kullanıcıların açık sohbetleri kuyruğa taşınacaktır."
        },
        totalCountUsers: "Toplam Kullanıcılar :"
      },
      campaigns: {
        title: "Kampanyalar",
        table: {
          name: "Kampanya Adı",
          status: "Durum",
          createdAt: "Oluşturulma Zamanı",
          connection: "Bağlantı",
          progress: "İlerleme",
          actions: "İşlem"
        },
        not_connection: "Bağlantı Yok",
        status: {
          concluded: "Tamamlandı",
          suspended: "Askıda",
          active: "Aktif"
        },
        buttons: {
          add: "Yeni Kampanya"
        },
        toasts: {
          created: "Kampanya başarılı bir şekilde oluşturuldu!",
          started: "Kampanya başarılı bir şekilde başladı!",
          suspended: "Kampanya başarılı bir şekilde durduruldu!"
        },
        remainingMessages: "Kalan Mesajlar :"
      },
      settings: {
        success: "Ayarlar başarılı bir şekilde kaydedildi!",
        title: "Ayarlar",
        settings: {
          language: "Otomatik olarak oluşturulan mesajların dili",
          timezone: "Zaman dilimi"
        }
      },
      messagesList: {
        header: {
          assignedTo: "İlgilenen :",
          buttons: {
            return: "Kuyruğa Al",
            resolve: "Kapat",
            reopen: "Yeniden Aç",
            accept: "Kabul"
          }
        }
      },
      contactMessage: {
        add: "Ekle"
      },

      messageMedia: {
        loading: "Yükleniyor..."
      },
      messagesInput: {
        maxUploadSize: "Yüklenen dosya 20 MB sınırını aşıyor",
        placeholder: {
          open: "Hızlı yanıt vermek için bir mesaj veya ' / ' yazın",
          closed: "Mesaj göndermek için bu bileti yeniden açın veya kabul edin",
          note: "Özel not ekle"
        },
        signMessage: "Unvan",
        dragAndDrop: "Dosya eklemek için sürükleyip bırakın",
        tooltips: {
          sendNote: "Özel not",
          sendMessage: "Açık Mesaj"
        }
      },
      contactDrawer: {
        header: "Kullanıcı Detayları",
        buttons: {
          edit: "Kullanıcı Düzenle"
        },
        extraInfo: "Diğer Bilgiler"
      },
      ticketOptionsMenu: {
        delete: "Sil",
        transfer: "Transfer",
        confirmationModal: {
          title: "Sohbeti Sil #",
          message: "Dikkat! Konuşmayla ilgili tüm mesajlar kaybolacak."
        },
        buttons: {
          delete: "Sil",
          cancel: "İptal"
        }
      },
      confirmationModal: {
        buttons: {
          confirm: "Tamam",
          cancel: "İptal"
        }
      },
      messageOptionsMenu: {
        delete: "Sil",
        reply: "Yanıtla",
        confirmationModal: {
          title: "Mesajı Sil?",
          message: "Bu işlem geri döndürülemez."
        }
      },
      maxUsersModal: {
        title: "Maksimum eşzamanlı kullanıcıya ulaşıldı!",
        subtitle:
          "Mevcut çevrimiçi kullanıcılar sözleşmeli kullanıcıları aştı, uygulamayı kullanmaya devam etmek için bir kullanıcının bağlantısını kesin.",
        table: {
          name: "İsim",
          lastSeen: "Son Görülme"
        },
        buttons: {
          disconnect: "Bağlantıyı Kes",
          logout: "Çıkış"
        },
        confirmationModal: {
          title: "Emin misiniz?",
          message: "Bağlantınız kesilecek."
        }
      },
      copyToClipboard: {
        copy: "Kopyala",
        copied: "Kopyalandı!"
      },
      retryMessageIcon: {
        error: "Mesaj gönderilirken hata oluştu. Yeniden denemek için tıklayın",
        loading: "Mesaj yeniden gönderiliyor..."
      },
      scheduledMessageIcon: {
        tooltip: "API'den gönderilmek üzere planlanmış mesaj"
      },
      sentFromApiIcon: {
        tooltip: "API'dan gönderildi"
      },
      messageVariablesPicker: {
        label: "Kullanılabilir Değişkenler",
        vars: {
          contactTreatment: "Kişi Sorunu",
          contactName: "Kişi İsmi",
          protocolNumber: "Protokol Numarası",
          contactNumber: "Kişi Numarası",
          greeting: "Karşılama"
        }
      },
      tokens: {
        title: "API Tokens",
        subtitle: "API Tokenlarını yönet",
        description:
          "Uygulama ile entegre etmek için tokenları kullanabilirsiniz. Bu API'yi kullanma hakkında daha fazla bilgi için Dokümanlar'ı ziyaret edin",
        table: {
          name: "İsim",
          secret: "Anahtar",
          actions: "İşlemler"
        },
        toasts: {
          tokenDeleted: "Token başarılı bir şekilde silindi!"
        },
        confirmationModal: {
          title: "Emin misiniz?",
          content:
            "Bu token'ı kullanan tüm sistemler yeniden yapılandırılmalıdır, aksi takdirde artık çalışmayacaktır.."
        },
        buttons: {
          new: "Yeni token"
        }
      },
      apiTokenModal: {
        title: "Token",
        name: "İsim",
        secret: "Anahtar",
        permissions: "İzinler",
        buttons: {
          save: "Kaydet",
          cancel: "İptal"
        },
        toasts: {
          noPermissions: "En az bir izin gereklidir.",
          success: "Token başarılı bir şekilde oluşturuldu!"
        }
      },
      initialConfig: {
        title: "İlk ayar",
        content1: "Whaticket 😊'a Hoşgeldiniz",
        content2:
          "Bunu kolaylaştırmak için * Hayatın, otomatik bir başlangıç ​​konfigürasyonu sağlıyoruz, böylece tüm Whaticket * * İnanılmaz * özelliklerini birkaç dakika içinde test edebilirsiniz.",
        content3:
          "* Tamam * tıklatarak, bir miktar * kuyruklar *, * chatbots *, * Hızlı Yanıtlar *, * Etiketler * ve A * WhatsApp bağlantısını oluşturalım. Bundan sonra, sadece sayfa * bağlantılardaki * QR kodunu * okuyun * bağlantılar * Testlere başlamak için. ",
        content4:
          "Bağlı sayıda ilk mesajı alır almaz, Whaticket eyleme geçecektir. 😎",
        content5:
          "Bütün bunları tek başına nasıl ayarlayacağınızı bilmek istiyorsanız, * Yardım * sayfasındaki videoları izleyebilir veya * Destek * ile temasa geçebilirsiniz.",
        content6: "İyi Testler! 🥰🥰"
      },
      languages: {
        undefined: "Dilim",
        "pt-BR": "Português",
        es: "Español",
        en: "English",
        tr: "Türkçe"
      },

      errorFallback: {
        error: "Uups, birşeyler yanlış gitti!",
        instructions: "Lütfen F5 yaparak sayfayı yenileyin ve tekrar deneyin!"
      },
      serviceWorker: {
        toast: "Yeni versiyon mevcut. Güncellemek için Tıklayın!"
      },
      backendErrors: {
        ERR_NO_OTHER_WHATSAPP:
          "En az bir tane WhatsApp bağlantısı olmak zorunda.",
        ERR_NO_DEF_WAPP_FOUND:
          "Varsayılan bir WhatsApp Hesabı bulunamadı. Lütfen Bağlantı sayfasını kontrol edin.",
        ERR_WAPP_NOT_INITIALIZED:
          "WhatsApp Oturumu başlatılamadı. Lütfen Bağlantı sayfasını kontrol edin.",
        ERR_WAPP_CHECK_CONTACT:
          "WhatsApp kişileri getirilemedi. Lütfen Bağlantı sayfasını kontrol edin.",
        ERR_WAPP_INVALID_CONTACT: "Bu uygun bir WhatsApp numarası gözükmüyor.",
        ERR_WAPP_DOWNLOAD_MEDIA:
          "Medya indirilemedi. Lütfen Bağlantı sayfasını kontrol edin.",
        ERR_INVALID_CREDENTIALS: "Doğrulama Hatası. Lütfen Tekrar deneyiniz.",
        ERR_SENDING_WAPP_MSG:
          "Mesaj gönderilirken hata oluştu. Lütfen Bağlantı sayfasını kontrol edin.",
        ERR_DELETE_WAPP_MSG: "Mesaj Silinemiyor!",
        ERR_OTHER_OPEN_TICKET:
          "Bu kişi ile zaten açık bir sohbetiniz bulunmakta.",
        ERR_SESSION_EXPIRED: "Oturum sonlandı. Lütfen Giriş Yapın.",
        ERR_USER_CREATION_DISABLED:
          "Kullanıcı oluşturulması yönetici tarafından engellendi.",
        ERR_NO_PERMISSION: "Bu kaynağa erişmek için yetkiniz yok.",
        ERR_DUPLICATED_CONTACT: "Bu numaraya ait bir kişi zaten mevcut.",
        ERR_NO_SETTING_FOUND: "Bu ID'ye ait bir ayar bulunamadı!",
        ERR_NO_CONTACT_FOUND: "Bu ID'ye ait bir kişi bulunamadı!",
        ERR_DUPLICATED_EMAIL: "Bu eposta zaten kayıtlı!",
        ERR_NO_TICKET_FOUND: "Bu ID'ye aiit bir sohbet bulunamadı!",
        ERR_NO_USER_FOUND: "Bu ID'ye ait bir kullanıcı bulunamadı!",
        ERR_DIFFERENT_PASSWORDS: "Farklı Şifreler",
        ERR_RECOVERY_EXPIRED: "Yenileme süresi doldu.",
        ERR_NO_EMAIL_FOUND: "Bu Eposta ile kullanıcı bulunamadı.",
        ERR_NO_WAPP_FOUND: "Bu ID ile WhatsApp bulunamadı.",
        ERR_CREATING_MESSAGE: "Veritabanında mesaj oluşturulurken hata oluştu.",
        ERR_MAX_WHATS_REACHED:
          "İzin verilen maksimum whatsapp hesaplarına ulaşıldı, satış ekibiyle iletişime geçin.",
        ERR_MAX_WHATS_EXCEEDED:
          "İzin verilen maksimum whatsapp hesabı aşıldı! Uygulamayı kullanmaya devam etmek için bazı bağlantıları kaldırın.",
        ERR_CREATING_TICKET: "Veritabanında sohbet oluşturulurken hata oluştu.",
        ERR_FETCH_WAPP_MSG:
          "WhatsApp'ta mesaj alınırken hata oluştu, mesaj çok eski olabilir.",
        ERR_QUEUE_COLOR_ALREADY_EXISTS:
          "Bu renk zaten kullanılıyor, başka bir tane seçin.",
        ERR_QUEUE_INVALID_COLOR: "Bu renk geçersiz.",
        ERR_WAPP_GREETING_REQUIRED:
          "Birden fazla kuyruk varsa karşılama mesajı gereklidir.",
        ERR_MAX_USERS_REACHED:
          "Maksimum eşzamanlı kullanıcı sayısına ulaşıldı.",
        ERR_TICKET_NO_WHATSAPP:
          "Bir bağlantı atamak için konuşma listesini kontrol edin.",
        ERR_CANT_IMPORT_MSGS:
          "İçe aktarmaya yalnızca kişinin ilk konuşmasında izin verilir",
        ERR_NOT_WHATSAPPS_ONLINE:
          "Kişileri eklemek veya güncellemek için çevrimiçi bağlantı gereklidir. Bağlantılar sayfasını kontrol edin",
        ERR_CANNOT_EDIT_GROUPS: "Grup kişilerini düzenlemeye izin verilmiyor",
        ERR_ACCOUNT_DISABLED:
          "Hesabınız devre dışı bırakıldı, daha fazla bilgi için bizimle iletişime geçin ",
        ERR_TAG_INVALID_NAME:
          "Etiket adı en az iki karakter uzunluğunda olmalıdır",
        ERR_FASTRESP_SHORTCUT_ALREADY_EXISTS:
          "Bu kısayolla hızlı bir yanıt zaten var",
        ERR_TAG_ALREADY_EXISTS: "Bu ada sahip bir etiket zaten var",
        ERR_SUBSCRIPTION_EXPIRED:
          "Aboneliğinizin süresi doldu. Abonelik sayfasını kontrol edin",
        ERR_PLAN_CHANGED_RECENTLY:
          "30 gün içinde birden fazla değişikliğe izin verilmez.",
        ERR_CEP_NOT_FOUND: "Posta kodu bulunamadı. Adresi manuel olarak girin",
        ERR_NUMBER_IS_NOT_VERIFIED:
          "Kişi doğrulanmadı, numarayı kontrol edin ve tekrar deneyin.",
        ERR_DUPLICATED_CONTACT_NINTH:
          "Bu numaraya ait bir kişi zaten bulunuyor.",
        ERR_LAST_ADMIN: "Hesapta en az bir tane yöneticiniz olmalıdır.",
        ERR_CREATING_COMPANY: "Hasabyňyzy döredip bolmaýar Goldaw goldawy.",
        ERR_INVALID_RECAPTCHA:
          "Howpsuzlygy barlamak säwligi, müşderi goldawyna ýüz tutuň."
      }
    }
  }
};

export { messages };
