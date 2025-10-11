import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Eye, Search } from 'lucide-react';
import { useState } from 'react';

interface Transaction {
  id: string;
  date: string;
  amount: string;
  transferor: string;
  transferee: string;
  type: string;
  status: 'PENDING' | 'COMPLETED';
}

const sampleTransactions: Transaction[] = [
  {
    id: 'TXN-001',
    date: '1/23/25',
    amount: '$2,500,000',
    transferor: 'Alex Downey',
    transferee: 'Sina Sojoodi',
    type: 'New Partner',
    status: 'PENDING',
  },
  {
    id: 'TXN-002',
    date: '1/22/25',
    amount: '$2,500,000',
    transferor: 'Alex Downey',
    transferee: 'Sina Sojoodi',
    type: 'New Partner',
    status: 'PENDING',
  },
  {
    id: 'TXN-003',
    date: '1/21/25',
    amount: '$2,500,000',
    transferor: 'Alex Downey',
    transferee: 'Sina Sojoodi',
    type: 'New Partner',
    status: 'COMPLETED',
  },
  {
    id: 'TXN-004',
    date: '1/20/25',
    amount: '$1,750,000',
    transferor: 'Sarah Chen',
    transferee: 'Marcus Williams',
    type: 'Investment',
    status: 'COMPLETED',
  },
  {
    id: 'TXN-005',
    date: '1/19/25',
    amount: '$3,200,000',
    transferor: 'Michael Johnson',
    transferee: 'Emma Davis',
    type: 'Acquisition',
    status: 'PENDING',
  },
  {
    id: 'TXN-006',
    date: '1/18/25',
    amount: '$1,100,000',
    transferor: 'Lisa Wong',
    transferee: 'James Brown',
    type: 'Settlement',
    status: 'COMPLETED',
  },
  {
    id: 'TXN-007',
    date: '1/17/25',
    amount: '$900,000',
    transferor: 'Robert Taylor',
    transferee: 'Amanda Wilson',
    type: 'Investment',
    status: 'PENDING',
  },
  {
    id: 'TXN-008',
    date: '1/16/25',
    amount: '$2,800,000',
    transferor: 'Kevin Lee',
    transferee: 'Sophia Martinez',
    type: 'New Partner',
    status: 'COMPLETED',
  },
];

function getStatusVariant(status: string) {
  switch (status) {
    case 'PENDING':
      return 'secondary';
    case 'COMPLETED':
      return 'default';
    default:
      return 'secondary';
  }
}

export function TableReference() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTransactions = sampleTransactions.filter(
    transaction =>
      transaction.transferor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.transferee.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.amount.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.date.includes(searchTerm),
  );

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Table Component</CardTitle>
        <CardDescription>Interactive data tables with search functionality and status badges.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="rounded-md border">
          <div className="max-h-96 overflow-y-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-white z-10">
                <TableRow className="bg-neutral-50 hover:bg-neutral-50">
                  <TableHead className="font-semibold text-neutral-700 border-r border-neutral-200">DATE</TableHead>
                  <TableHead className="font-semibold text-neutral-700 border-r border-neutral-200">AMOUNT</TableHead>
                  <TableHead className="font-semibold text-neutral-700 border-r border-neutral-200">
                    TRANSFEROR
                  </TableHead>
                  <TableHead className="font-semibold text-neutral-700 border-r border-neutral-200">
                    TRANSFEREE
                  </TableHead>
                  <TableHead className="font-semibold text-neutral-700 border-r border-neutral-200">TYPE</TableHead>
                  <TableHead className="font-semibold text-neutral-700 border-r border-neutral-200">STATUS</TableHead>
                  <TableHead className="font-semibold text-neutral-700 text-right">ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map(transaction => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium border-r border-neutral-100">{transaction.date}</TableCell>
                      <TableCell className="font-semibold border-r border-neutral-100">{transaction.amount}</TableCell>
                      <TableCell className="border-r border-neutral-100">{transaction.transferor}</TableCell>
                      <TableCell className="border-r border-neutral-100">{transaction.transferee}</TableCell>
                      <TableCell className="border-r border-neutral-100">{transaction.type}</TableCell>
                      <TableCell className="border-r border-neutral-100">
                        <Badge variant={getStatusVariant(transaction.status)}>{transaction.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No transactions found matching your search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
