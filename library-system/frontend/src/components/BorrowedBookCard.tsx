import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BorrowedBook } from '../types';
import { formatDate } from '../utils/dateFormatter';
import { Button } from './Button';
import {
  BookOpen,
  CalendarDays,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react-native';

interface BorrowedBookCardProps {
  borrowedBook: BorrowedBook;
  onReturn: () => void;
  loading?: boolean;
}

export const BorrowedBookCard: React.FC<BorrowedBookCardProps> = ({
  borrowedBook,
  onReturn,
  loading,
}) => {
  const isOverdue =
    new Date(borrowedBook.dueDate) < new Date() && !borrowedBook.returnedDate;

  const isReturned = !!borrowedBook.returnedDate;

  return (
    <View style={styles.card}>
      {/* Top row: icon + title/author */}
      <View style={styles.topRow}>
        <View style={styles.iconWrapper}>
          <BookOpen size={24} color={PURPLE} />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.title} numberOfLines={1}>
            {borrowedBook.book.title}
          </Text>
          <Text style={styles.author} numberOfLines={1}>
            by {borrowedBook.book.author.name}
          </Text>
        </View>
      </View>

      {/* Dates section */}
      <View style={styles.datesBlock}>
        <View style={styles.dateRow}>
          <CalendarDays size={16} color="#7A7493" />
          <Text style={styles.dateLabel}>
            Borrowed: {formatDate(borrowedBook.borrowedDate)}
          </Text>
        </View>

        <View style={styles.dateRow}>
          <CalendarDays size={16} color={isOverdue ? RED : '#7A7493'} />
          <Text
            style={[
              styles.dateLabel,
              isOverdue && styles.overdueDateLabel,
            ]}
          >
            Due: {formatDate(borrowedBook.dueDate)}
          </Text>
        </View>

        {isReturned && (
          <View style={styles.dateRow}>
            <CheckCircle2 size={16} color={GREEN} />
            <Text style={styles.returnedLabel}>
              Returned: {formatDate(borrowedBook.returnedDate!)}
            </Text>
          </View>
        )}
      </View>

      {/* Status + Action */}
      {!isReturned ? (
        <View style={styles.footer}>
          {isOverdue && (
            <View style={styles.statusRow}>
              <AlertTriangle size={16} color={RED} />
              <Text style={styles.overdueText}>Overdue – please return</Text>
            </View>
          )}

          <Button
            title="Return Book"
            onPress={onReturn}
            loading={loading}
            variant="primary"
          />
        </View>
      ) : (
        <View style={styles.statusPill}>
          <CheckCircle2 size={16} color={GREEN} />
          <Text style={styles.statusPillText}>Returned</Text>
        </View>
      )}
    </View>
  );
};

const PURPLE = '#7B61FF';
const GREEN = '#16A34A';
const RED = '#DC2626';

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 22,
    marginBottom: 14,

    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  iconWrapper: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: '#ECE5FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1D1033',
    marginBottom: 2,
  },

  author: {
    fontSize: 13,
    color: '#7A7493',
  },

  datesBlock: {
    marginTop: 4,
    marginBottom: 10,
  },

  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 6,
  },

  dateLabel: {
    fontSize: 12,
    color: '#7A7493',
  },

  overdueDateLabel: {
    color: RED,
    fontWeight: '600',
  },

  returnedLabel: {
    fontSize: 12,
    color: GREEN,
    fontWeight: '600',
  },

  footer: {
    marginTop: 4,
  },

  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },

  overdueText: {
    fontSize: 13,
    fontWeight: '600',
    color: RED,
  },

  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    marginTop: 6,
  },

  statusPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: GREEN,
  },
});
