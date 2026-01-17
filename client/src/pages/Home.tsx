import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Mail, MapPin, Shield, Clock, DollarSign, Award, CheckCircle2, Menu, X } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface Service {
  id: string;
  title: string;
  shortDesc: string;
  price: string;
  image: string;
  fullDescription: string;
  features: string[];
}

const services: Service[] = [
  {
    id: "aps",
    title: "Автоматическая пожарная сигнализация (АПС)",
    shortDesc: "Ваша защита от огня и штрафов МЧС под ключ",
    price: "от 20 000 ₽",
    image: "/service-fire-alarm.jpg",
    fullDescription: "Установка АПС - это не только требование законодательства, но и единственный способ обнаружить возгорание на ранней стадии, когда ущерб минимален. Мы берем на себя всё: от проектирования до сдачи объекта.",
    features: [
      "Быстрый старт: Монтаж системы всего за 1 день",
      "Прозрачная цена: Стоимость установки - от 20 000 рублей",
      "Готовое решение: В комплект входят приемный прибор, АКБ, 6 дымовых датчиков, ручная кнопка, звуковой и световой оповещатели, кабель",
      "Профессиональный подход: Подбираем оборудование для максимума безопасности при минимальных расходах",
      "Обслуживание АПС (от 500 руб/мес): Минимизируем ложные срабатывания, ведем журналы для МЧС, выезжаем в течение 2 часов"
    ]
  },
  {
    id: "os",
    title: "Охранная сигнализация (ОС)",
    shortDesc: "Надежный контроль доступа и защита имущества 24/7",
    price: "от 25 000 ₽",
    image: "/service-security.jpg",
    fullDescription: "Охранная сигнализация от АТАР мгновенно фиксирует факт проникновения на территорию и оповещает вас об этом. Мы создаем надежный барьер на пути злоумышленников.",
    features: [
      "Оперативность: Монтаж системы от 1 дня",
      "Доступность: Стоимость монтажа - от 25 000 рублей",
      "Умный контроль: GSM-модуль для дозвона и передачи тревожного сигнала на телефон",
      "Полный комплект: Прибор управления, аккумулятор, датчики движения (3 шт.), датчик вскрытия двери, светозвуковая сирена",
      "Гарантия: Профессиональный монтаж и проектирование с гарантией на работы"
    ]
  },
  {
    id: "svn",
    title: "Системы видеонаблюдения (СВН)",
    shortDesc: "Визуальный контроль вашего бизнеса из любой точки мира",
    price: "от 25 000 ₽",
    image: "/service-video.jpg",
    fullDescription: "Система видеонаблюдения позволяет не только фиксировать события, но и оперативно реагировать на любые несанкционированные действия.",
    features: [
      "Все под контролем: Настроим удаленный просмотр с мобильного устройства",
      "Выгодное предложение: Монтаж от 25 000 рублей",
      "Качественная база: Видеорегистратор с архивом до 2 недель, две внутренние камеры (720р), микрофон с шумоподавлением",
      "Обучение: Обучаем вас и ваших сотрудников пользоваться системой",
      "Сервис: За 500 рублей в месяц проводим ежемесячную настройку и юстировку камер"
    ]
  },
  {
    id: "pb",
    title: "Комплексная пожарная безопасность",
    shortDesc: "Полный аудит и подготовка объекта к проверкам МЧС",
    price: "Индивидуальный расчет",
    image: "/service-safety.jpg",
    fullDescription: "Согласно ФЗ-№69, ответственность за пожарную безопасность несет руководитель. Мы поможем вам соблюсти все нормы закона, сэкономив ваше время и бюджет.",
    features: [
      "Документация: Разработаем все необходимые инструкции, приказы и журналы по ПБ",
      "Обучение: Проведем пожарно-технический минимум для ответственных лиц и инструктаж для персонала",
      "Техническое оснащение: Укомплектуем объект огнетушителями, разработаем планы эвакуации, проведем огнезащитную обработку и проверку пожарных кранов",
      "Индивидуальный расчет: Стоимость рассчитывается под ваш объект, внедрение занимает от 1 дня"
    ]
  }
];

const advantages = [
  {
    icon: Clock,
    title: "Скорость без потери качества",
    description: "Выезд специалиста по заявке в течение 2 часов"
  },
  {
    icon: DollarSign,
    title: "Экономия",
    description: "Подбираем оптимальное оборудование под ваш бюджет без переплат"
  },
  {
    icon: Shield,
    title: "Надежность",
    description: "Ведем журналы работ и берем на себя ответственность перед контролирующими органами"
  },
  {
    icon: Award,
    title: "Профессионализм",
    description: "Опыт работы с объектами любой сложности - от магазинов до медицинских центров"
  }
];

const clients = [
  "ФБУН ГНЦ ВБ Вектор Роспотребнадзора",
  "Сеть магазинов Светофор",
  "АО РТК (МТС)",
  "Городская клиническая поликлиника №13",
  "ГБУЗ НСО Убинская ЦРБ",
  "ТСН ТСЖ Феникс",
  "ТСН Весна",
  "ООО Столица запчастей"
];

export default function Home() {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [contactFormOpen, setContactFormOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "" });

  const submitContactMutation = trpc.contact.submit.useMutation({
    onSuccess: () => {
      toast.success("Заявка отправлена! Мы свяжемся с вами в ближайшее время.");
      setContactFormOpen(false);
      setFormData({ name: "", phone: "" });
    },
    onError: (error: { message: string }) => {
      toast.error(`Ошибка отправки: ${error.message}`);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Пожалуйста, введите имя");
      return;
    }
    if (formData.phone.length !== 10) {
      toast.error("Введите 10 цифр номера телефона");
      return;
    }
    submitContactMutation.mutate({
      name: formData.name,
      phone: `+7${formData.phone}`,
    });
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="container">
          <div className="flex items-center justify-between py-4">
            {/* Logo and Slogan */}
            <div className="flex items-center gap-4">
              <img src="/logo.png" alt="АТАР" className="h-12 w-auto" />
              <div className="hidden md:block">
                <p className="text-sm text-muted-foreground font-medium">Укрощаем огонь, защищаем бизнес</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6">
              <div className="relative group">
                <button className="text-sm font-medium hover:text-primary transition-colors">
                  Услуги
                </button>
                <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  {services.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => scrollToSection("services")}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-accent transition-colors"
                    >
                      {service.title}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={() => scrollToSection("about")} className="text-sm font-medium hover:text-primary transition-colors">
                О компании
              </button>
              <button onClick={() => scrollToSection("contacts")} className="text-sm font-medium hover:text-primary transition-colors">
                Контакты
              </button>
            </nav>

            {/* Contact Info and CTA */}
            <div className="hidden lg:flex items-center gap-4">
              <a href="tel:+73832910176" className="text-sm font-semibold hover:text-primary transition-colors">
                291-01-76
              </a>
              <Button onClick={() => setContactFormOpen(true)} size="sm">
                Вызвать специалиста
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-4 border-t border-border">
              <nav className="flex flex-col gap-4">
                <button onClick={() => scrollToSection("services")} className="text-left font-medium">
                  Услуги
                </button>
                <button onClick={() => scrollToSection("about")} className="text-left font-medium">
                  О компании
                </button>

                <button onClick={() => scrollToSection("contacts")} className="text-left font-medium">
                  Контакты
                </button>
                <a href="tel:+73832910176" className="font-semibold text-primary">
                  291-01-76
                </a>
                <Button onClick={() => { setContactFormOpen(true); setMobileMenuOpen(false); }} className="w-full">
                  Получить консультацию
                </Button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="absolute inset-0 z-0">
          <img src="/hero-bg.jpg" alt="Пожарная безопасность" className="w-full h-full object-cover opacity-20" />
        </div>
        <div className="container relative z-10 py-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Комплексная безопасность вашего бизнеса
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Проектируем, монтируем и обслуживаем системы противопожарной и охранной защиты с 2016 года. 
              Гарантируем соблюдение законодательства и оперативный монтаж от 1 дня.
            </p>
            <Button size="lg" onClick={() => setContactFormOpen(true)} className="text-lg px-8">
              Получить консультацию
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-muted/30">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Наши ключевые услуги</h2>
          <p className="text-center text-muted-foreground mb-12">Мы закрываем все вопросы безопасности под ключ</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map((service) => (
              <Card key={service.id} className="flex flex-col hover:shadow-lg transition-shadow">
                <div className="h-36 overflow-hidden rounded-t-lg">
                  <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                </div>
                <CardHeader className="pb-2 pt-3 px-4">
                  <CardTitle className="text-base">{service.title}</CardTitle>
                  <CardDescription className="text-xs leading-tight">{service.shortDesc}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow pt-0 pb-2 px-4">
                  <div className="flex items-baseline gap-1">
                    <p className="text-lg font-bold text-primary">{service.price}</p>
                  </div>
                </CardContent>
                <CardFooter className="pt-0 pb-3 px-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full"
                    onClick={() => setSelectedService(service)}
                  >
                    Подробнее
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="py-20">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Почему выбирают АТАР?</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {advantages.map((advantage, index) => {
              const Icon = advantage.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{advantage.title}</h3>
                  <p className="text-muted-foreground">{advantage.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-muted/30">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">О компании АТАР</h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg mb-6">
              С 2016 года мы обеспечиваем защиту объектов в Новосибирске и области, предоставляя полный спектр услуг 
              в сфере пожарной и охранной безопасности. Наша миссия - создавать надежные системы, которые защищают 
              жизни людей и материальные ценности, полностью соответствуя законодательству РФ.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div className="flex gap-4">
                <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Комплексный подход</h3>
                  <p className="text-muted-foreground">
                    Берем на себя проектирование, монтаж и эксплуатацию систем охранно-пожарной сигнализации, 
                    видеонаблюдения и всех видов пожаротушения
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Соблюдение законов</h3>
                  <p className="text-muted-foreground">
                    Все наши решения строго соответствуют требованиям МЧС и федеральному законодательству (ФЗ-№69)
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Оперативность</h3>
                  <p className="text-muted-foreground">
                    Выезд технического специалиста по заявке осуществляется в течение 2 часов
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Опыт работы с лидерами</h3>
                  <p className="text-muted-foreground">
                    Успешно сотрудничаем с объектами высокой сложности - от медицинских центров до крупных торговых сетей
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clients Section */}
      <section id="clients" className="py-20">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Нам доверяют лидеры рынка</h2>
          <p className="text-center text-muted-foreground mb-12">
            Мы успешно реализовали проекты для крупнейших организаций региона
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {clients.map((client, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-md transition-shadow">
                <p className="font-medium">{client}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer / Contacts */}
      <footer id="contacts" className="bg-muted/50 py-12 border-t border-border">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-lg mb-4">Офисы в Новосибирске</h3>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
                  <p>ул. Кропоткина 201, оф. 13</p>
                </div>
                <div className="flex gap-2">
                  <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
                  <p>ул. Березовая, 13</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">Телефоны</h3>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                  <a href="tel:+73832910176" className="hover:text-primary transition-colors">291-01-76</a>
                </div>
                <div className="flex gap-2">
                  <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                  <a href="tel:+79237855571" className="hover:text-primary transition-colors">923-785-55-71</a>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">Email</h3>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                  <a href="mailto:info@atar.group" className="hover:text-primary transition-colors">info@atar.group</a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>© 2016-2026 АТАР. Комплексная безопасность вашего бизнеса.</p>
          </div>
        </div>
      </footer>

      {/* Service Details Modal */}
      <Dialog open={!!selectedService} onOpenChange={() => setSelectedService(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedService && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedService.title}</DialogTitle>
                <DialogDescription className="text-lg">{selectedService.shortDesc}</DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <img 
                  src={selectedService.image} 
                  alt={selectedService.title} 
                  className="w-full h-64 object-cover rounded-lg"
                />
                
                <p className="text-3xl font-bold text-primary">{selectedService.price}</p>
                
                <p className="text-base">{selectedService.fullDescription}</p>
                
                <div className="space-y-2">
                  {selectedService.features.map((feature, index) => (
                    <div key={index} className="flex gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <p>{feature}</p>
                    </div>
                  ))}
                </div>
                
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={() => {
                    setSelectedService(null);
                    setContactFormOpen(true);
                  }}
                >
                  Заказать консультацию
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Contact Form Modal */}
      <Dialog open={contactFormOpen} onOpenChange={setContactFormOpen}>
        <DialogContent className="p-8">
          <DialogHeader>
            <DialogTitle>Получить консультацию</DialogTitle>
            <DialogDescription>
              Оставьте ваши контактные данные, и мы свяжемся с вами в ближайшее время
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">Имя</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ваше имя"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Телефон</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium px-3 py-2 bg-muted rounded-md">+7</span>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    if (value.length <= 10) {
                      setFormData({ ...formData, phone: value });
                    }
                  }}
                  placeholder="9001234567"
                  maxLength={10}
                  required
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={submitContactMutation.isPending}
            >
              {submitContactMutation.isPending ? "Отправка..." : "Отправить заявку"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
