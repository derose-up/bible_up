// src/components/pdf/PdfLicao.tsx
import React from 'react';
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Svg,
  Path,
} from '@react-pdf/renderer';
import { Licao } from '../../types';
import LogoImage from '/logo.png';

const primaryColor = '#9333ea';
const gray = '#444';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    color: gray,
    position: 'relative',
  },
  title: {
    fontSize: 22,
    color: primaryColor,
    marginBottom: 6,
    textAlign: 'center',
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  categoryBadge: {
    fontSize: 10,
    marginBottom: 20,
    padding: 6,
    borderRadius: 4,
    backgroundColor: primaryColor + '20',
    color: primaryColor,
    textAlign: 'center',
  },
  section: {
    marginBottom: 18,
    padding: 10,
    border: `1 solid ${primaryColor}`,
    borderRadius: 6,
    backgroundColor: '#f9f5ff',
  },
  headingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  headingText: {
    fontSize: 14,
    color: primaryColor,
    fontWeight: 'bold',
    textDecoration: 'underline',
  },
  content: {
    fontSize: 12,
    color: gray,
    lineHeight: 1.5,
  },
  watermark: {
    position: 'absolute',
    top: '35%',
    left: '25%',
    opacity: 0.05,
    transform: 'rotate(-30deg)',
    width: 300,
  },
  headerLogo: {
    width: 60,
    marginBottom: 10,
    alignSelf: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 30,
    right: 30,
    fontSize: 10,
    color: '#aaa',
    textAlign: 'center',
  },
  pageNumber: {
    position: 'absolute',
    bottom: 20,
    right: 30,
    fontSize: 10,
    color: '#aaa',
  },
  borderTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: primaryColor,
  },
  notasEspaco: {
    minHeight: 80,
  },
});

const renderFormattedText = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <Text key={i} style={{ fontWeight: 'bold' }}>
        {part.replace(/\*\*/g, '')}
      </Text>
    ) : (
      <Text key={i}>{part}</Text>
    )
  );
};

const Icon = ({ path }: { path: string }) => (
  <Svg viewBox="0 0 24 24" width="14" height="14" style={{ marginRight: 4 }}>
    <Path d={path} fill={primaryColor} />
  </Svg>
);

const icons = {
  historia: 'M2 4v16h20V4H2zm2 2h16v12H4V6zm4 2v8h8V8H8z',
  aplicacao: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm1-13l-2 8 8-2-6-6z',
  dinamica: 'M17 1l4 4-4 4M7 23l-4-4 4-4M3 12a9 9 0 0115-6.7M21 12a9 9 0 01-15 6.7',
  atividade: 'M12 20h9M16.5 3.5l4 4L7 21H3v-4L16.5 3.5z',
  oracao: 'M12 21s-8-5.33-8-10a4 4 0 018-4 4 4 0 018 4c0 4.67-8 10-8 10z',
  notas: 'M3 6h18v2H3V6zm0 5h12v2H3v-2zm0 5h18v2H3v-2z',
};

interface Props {
  licao: Licao;
}

const PdfLicao: React.FC<Props> = ({ licao }) => {
  const status = licao.isPremium ? 'Premium' : 'Gratuito';
  const dataAtual = new Date().toLocaleDateString();

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.borderTop} />
        <Image src={LogoImage} style={styles.watermark} />
        <Image src={LogoImage} style={styles.headerLogo} />
        <Text style={styles.title}>{licao.titulo}</Text>
        <Text style={styles.categoryBadge}>
          {licao.categoria} • {status}
        </Text>

        {licao.historia && (
          <View style={styles.section}>
            <View style={styles.headingRow}>
              <Icon path={icons.historia} />
              <Text style={styles.headingText}>História Bíblica</Text>
            </View>
            <Text style={styles.content}>{renderFormattedText(licao.historia)}</Text>
          </View>
        )}

        {licao.aplicacao && (
          <View style={styles.section}>
            <View style={styles.headingRow}>
              <Icon path={icons.aplicacao} />
              <Text style={styles.headingText}>Aplicação</Text>
            </View>
            <Text style={styles.content}>{renderFormattedText(licao.aplicacao)}</Text>
          </View>
        )}

        {licao.dinamica && (
          <View style={styles.section}>
            <View style={styles.headingRow}>
              <Icon path={icons.dinamica} />
              <Text style={styles.headingText}>Dinâmica</Text>
            </View>
            <Text style={styles.content}>{renderFormattedText(licao.dinamica)}</Text>
          </View>
        )}

        {licao.atividade && (
          <View style={styles.section}>
            <View style={styles.headingRow}>
              <Icon path={icons.atividade} />
              <Text style={styles.headingText}>Atividade</Text>
            </View>
            <Text style={styles.content}>{renderFormattedText(licao.atividade)}</Text>
          </View>
        )}

        {licao.oracao && (
          <View style={styles.section}>
            <View style={styles.headingRow}>
              <Icon path={icons.oracao} />
              <Text style={styles.headingText}>Oração</Text>
            </View>
            <Text style={styles.content}>{renderFormattedText(licao.oracao)}</Text>
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.headingRow}>
            <Icon path={icons.notas} />
            <Text style={styles.headingText}>Notas do Professor</Text>
          </View>
          <Text style={styles.content}>{'\n\n\n\n\n\n\n'}</Text>
        </View>

        <Text style={styles.footer}>
          BibleUp • www.upcreations.com.br • Gerado em {dataAtual}
        </Text>

        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `Página ${pageNumber} de ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  );
};

export default PdfLicao;
