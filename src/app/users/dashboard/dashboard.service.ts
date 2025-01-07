import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Evenement } from '../user-list/models/event';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor() {}

  getEvents(): Observable<Evenement[]> {
    return of([
      {
        id: '1',
        description:
          'La conférence "Tech Innov 2025" est un événement annuel rassemblant des professionnels, des chercheurs, et des étudiants passionnés par les nouvelles technologies. Cette édition mettra ccent sur les innovations dans intelligence artificielle, IoT, et la cybersécurité.',
        url: 'assets/logos/music.png',
        title: 'Tech Innov 2025',
        rate: 1,
        price: 200,
        
      },
      {
        id: '2',
        description:
          'Le festival "Sounds of the Future" est une expérience musicale unique mettant en lumière les artistes émergents de la scène électronique et alternative. Une soirée inoubliable où musique, lumière et innovation se rencontrent pour offrir un spectacle époustouflant.',
        url: 'assets/logos/hafla.jpeg',
        title: 'Sounds of the Future',
        rate: 4,
        price: 250,
      },
      {
        id: '3',
        description:
          'Le séminaire "Leadership et Innovation 2025" vise à réunir des leaders entreprise, des cadres, et des entrepreneurs pour explorer les nouvelles approches en matière de gestion, de leadership, et innovation. Une opportunité unique pour apprendre, échanger des idées, et développer de nouvelles stratégies dans un monde en constante évolution.',
        url: 'assets/logos/management.jpeg',
        title: 'Leadership et Innovation 2025',
        rate: 3,
        price: 300,
      },
      {
        id: '4',
        description:
          'Liste des agents de sécurité et assignation des zones à surveiller. Gestion des accès VIP avec QR codes personnalisés.',
        url: 'assets/logos/spot-me.webp',
        title: 'Optima Soft',
        rate: 5,
        price: 400,
      },
      {
        id: '5',
        description:
          'La Journée Portes Ouvertes de l’Université Sésame est une occasion unique pour les futurs étudiants, les parents, et les partenaires de découvrir l’offre académique, les installations modernes, et les opportunités d’intégration professionnelle proposées par l’université.',
        url: `assets/logos/sesame.png`,
        title: 'Portes Ouvertes',
        rate: 1,
        price: 450,
      },
      {
        id: '6',
        description:
          'La Nuit des Étoiles est une soirée de gala élégante, rassemblant des invités dans une ambiance festive et raffinée. Au programme : dîner gastronomique, spectacle live, et une soirée dansante inoubliable.',
        url: 'assets/logos/mariage.jpeg',
        title: 'Nuit des Étoiles',
        rate: 2,
        price: 150,
      },
    ]);
  }
}
