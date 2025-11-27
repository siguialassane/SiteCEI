import React from 'react';
import { CheckCircle, MapPin, FileText, Clock, Globe, Phone, AlertCircle, DoorOpen } from 'lucide-react';

export const guideSteps = [
    {
        title: "Vérifier son inscription",
        description: "Avant tout, assurez-vous d'être bien inscrit sur la liste électorale. Sans ça, impossible de voter !",
        details: [
            "Consultez le site de la CEI",
            "Ou composez le *919# sur votre mobile"
        ],
        type: "video",
        media: "/1er_video.mp4",
        icon: <CheckCircle size={24} />,
        moreInfo: {
            title: "Tout savoir sur l'inscription",
            sections: [
                {
                    title: "1. Vérification en ligne",
                    icon: <Globe size={20} />,
                    content: "Rendez-vous sur le site officiel de la CEI (www.cei.ci) dans la rubrique 'Vérifier mon inscription'. Vous aurez besoin de votre numéro d'électeur ou de votre numéro CNI."
                },
                {
                    title: "2. Vérification par mobile",
                    icon: <Phone size={20} />,
                    content: "Composez le code *919# sur les réseaux Orange, MTN ou Moov. Suivez les instructions et entrez votre numéro de CNI pour recevoir votre statut par SMS."
                },
                {
                    title: "3. Je ne suis pas inscrit(e) ?",
                    icon: <AlertCircle size={20} />,
                    content: "Si vous n'êtes pas sur la liste, vous devez attendre la période de 'Révision de la Liste Électorale' (RLE). Rendez-vous dans un centre d'enrôlement avec votre CNI ou votre Certificat de Nationalité + Récépissé d'enrôlement ONECI."
                }
            ]
        }
    },
    {
        title: "Connaître son bureau",
        description: "Votre bureau de vote est unique. Vous ne pouvez pas voter ailleurs.",
        details: [
            "Vérifiez l'adresse exacte à l'avance",
            "Notez le numéro de votre bureau"
        ],
        type: "image",
        media: "/2eme_ecran.png",
        icon: <MapPin size={24} />,
        moreInfo: {
            title: "Comment trouver mon bureau de vote",
            sections: [
                {
                    title: "1. Via le site de la CEI",
                    icon: <Globe size={20} />,
                    content: "Rendez-vous sur www.cei.ci et cherchez votre bureau de vote en utilisant : votre numéro d'électeur (sur votre carte), votre numéro de formulaire 2025, ou vos nom/prénoms avec date de naissance (format JJ/MM/AAAA)."
                },
                {
                    title: "2. Par code USSD mobile",
                    icon: <Phone size={20} />,
                    content: "Composez *919# ou #919# depuis votre téléphone portable (Orange, MTN ou Moov). Suivez les instructions pour recevoir les informations sur votre bureau de vote par SMS."
                },
                {
                    title: "3. Listes des bureaux de vote",
                    icon: <MapPin size={20} />,
                    content: "Sur le site de la CEI, vous pouvez consulter les listes complètes des lieux de vote par région, département, sous-préfecture et commune. Ces listes indiquent précisément l'adresse de chaque bureau."
                },
                {
                    title: "4. Où trouver mon numéro d'électeur ?",
                    icon: <FileText size={20} />,
                    content: "Votre numéro d'électeur est imprimé sur votre carte électorale, généralement libellé 'numéro national d'électeur'. Si vous ne l'avez pas, utilisez votre CNI ou vos informations personnelles sur cei.ci."
                },
                {
                    title: "5. Important : Un seul bureau !",
                    icon: <AlertCircle size={20} />,
                    content: "Vous êtes rattaché à UN SEUL bureau de vote. Impossible de voter ailleurs, même dans la même commune. Vérifiez bien l'adresse exacte et le numéro de bureau avant le jour J pour éviter tout déplacement inutile."
                }
            ]
        }
    },
    {
        title: "Documents obligatoires",
        description: "Le jour J, vous devez impérativement avoir vos documents.",
        details: [
            "1. Carte d'électeur (Obligatoire)",
            "2. Carte Nationale d'Identité (CNI)"
        ],
        type: "image",
        media: "/3eme_ecran.png",
        icon: <FileText size={24} />,
        moreInfo: {
            title: "Tout savoir sur les documents requis",
            sections: [
                {
                    title: "1. Carte d'électeur : OBLIGATOIRE",
                    icon: <FileText size={20} />,
                    content: "La carte d'électeur est LE document principal et OBLIGATOIRE pour voter. Elle prouve que vous êtes bien inscrit sur la liste électorale. Sans elle, vous ne pourrez pas voter, même avec votre CNI."
                },
                {
                    title: "2. Carte Nationale d'Identité (CNI)",
                    icon: <FileText size={20} />,
                    content: "La CNI en cours de validité sert à vérifier votre identité. Elle est demandée en complément de la carte d'électeur pour confirmer que vous êtes bien la personne inscrite."
                },
                {
                    title: "3. Vérification biométrique possible",
                    icon: <AlertCircle size={20} />,
                    content: "Dans certains bureaux de vote, une vérification biométrique des empreintes digitales peut être effectuée pour renforcer la sécurité du scrutin et éviter les fraudes."
                },
                {
                    title: "4. Conditions pour être électeur",
                    icon: <CheckCircle size={20} />,
                    content: "Selon le Code électoral de 2020 : être de nationalité ivoirienne, avoir au moins 18 ans révolus, être inscrit sur la liste électorale, jouir de ses droits civils et politiques, et ne pas être dans un cas d'incapacité prévu par la loi."
                },
                {
                    title: "5. Que faire si j'ai perdu mes documents ?",
                    icon: <Phone size={20} />,
                    content: "Si vous avez perdu votre carte d'électeur, contactez rapidement la CEI ou votre commission électorale locale. Pour la CNI, adressez-vous à l'ONECI (Office National de l'État Civil et de l'Identification)."
                }
            ]
        }
    },
    {
        title: "Le Jour J : Arrivée",
        description: "Les bureaux ouvrent à 8h00. Soyez matinaux !",
        details: [
            "Faites la queue calmement",
            "Préparez vos documents à l'entrée"
        ],
        type: "image",
        media: "/4eme_ecran.png",
        icon: <Clock size={24} />,
        moreInfo: {
            title: "Conseils pour le jour du vote",
            sections: [
                {
                    title: "1. Horaires d'ouverture",
                    icon: <Clock size={20} />,
                    content: "Les bureaux de vote ouvrent généralement à 8h00 du matin. Il est recommandé d'arriver tôt pour éviter les longues files d'attente, surtout en milieu de journée."
                },
                {
                    title: "2. Horaires de fermeture",
                    icon: <Clock size={20} />,
                    content: "Les bureaux ferment généralement à 17h00 (5h du soir). Si un bureau a ouvert en retard, sa fermeture peut être prolongée jusqu'à 19h00 pour compenser. À Abidjan, certains bureaux peuvent fermer à 18h00."
                },
                {
                    title: "3. Préparez vos documents",
                    icon: <FileText size={20} />,
                    content: "Avant de quitter la maison, vérifiez que vous avez bien votre carte d'électeur ET votre CNI. Rangez-les dans un endroit facilement accessible pour accélérer le processus à votre arrivée."
                },
                {
                    title: "4. Patience dans la file d'attente",
                    icon: <AlertCircle size={20} />,
                    content: "Attendez calmement votre tour. Les membres du bureau de vote sont là pour vous aider. Respectez les consignes et gardez vos distances avec les autres électeurs."
                },
                {
                    title: "5. Vous êtes en retard ?",
                    icon: <Clock size={20} />,
                    content: "Si vous arrivez juste avant la fermeture, vous pourrez encore voter si vous êtes dans la file d'attente AVANT l'heure de fermeture officielle. Ne vous découragez pas !"
                }
            ]
        }
    },
    {
        title: "Entrer dans le bureau de vote",
        description: "Votre tour est arrivé. Présentez vos documents et entrez dans le bureau.",
        details: [
            "Présentez votre carte d'électeur et CNI",
            "Le secrétaire vérifie votre identité",
            "Vérification sur la liste d'émargement",
            "Contrôle : pas d'encre indélébile sur les mains"
        ],
        type: "image",
        media: "/5eme_ecran.png",
        icon: <DoorOpen size={24} />,
        moreInfo: {
            title: "Processus d'entrée au bureau de vote",
            sections: [
                {
                    title: "1. Présentation des documents",
                    icon: <FileText size={20} />,
                    content: "Présentez votre carte d'électeur ET votre CNI au secrétaire n°1 du bureau de vote. Ces deux documents sont nécessaires pour prouver votre identité et votre qualité d'électeur."
                },
                {
                    title: "2. Vérification d'identité",
                    icon: <CheckCircle size={20} />,
                    content: "Le secrétaire vérifie que votre identité correspond bien aux documents présentés et à votre inscription sur la liste électorale. Cette vérification peut se faire via votre carte d'électeur, ou à défaut, par un kit biométrique."
                },
                {
                    title: "3. Contrôle biométrique (si applicable)",
                    icon: <AlertCircle size={20} />,
                    content: "Dans certains bureaux équipés, une vérification biométrique de vos empreintes digitales peut être effectuée pour renforcer la sécurité. Cela permet de confirmer que vous êtes bien la personne inscrite sur la liste."
                },
                {
                    title: "4. Vérification sur liste d'émargement",
                    icon: <FileText size={20} />,
                    content: "Le secrétaire cherche votre nom sur la liste d'émargement du bureau. Cette liste contient tous les électeurs autorisés à voter dans ce bureau spécifique. Votre nom doit y figurer pour pouvoir continuer."
                },
                {
                    title: "5. Contrôle des mains (encre indélébile)",
                    icon: <AlertCircle size={20} />,
                    content: "Le secrétaire vérifie que vos mains ne portent pas déjà de traces d'encre indélébile. Si vous avez de l'encre, cela signifie que vous avez déjà voté et vous serez refoulé. L'incident sera signalé aux autorités compétentes."
                },
                {
                    title: "6. Autorisation d'entrer",
                    icon: <DoorOpen size={20} />,
                    content: "Si toutes les vérifications sont positives, vous êtes autorisé à entrer dans le bureau de vote pour procéder au scrutin. Le Président du bureau régule l'entrée des électeurs pour assurer le bon déroulement des opérations."
                }
            ]
        }
    }
];
